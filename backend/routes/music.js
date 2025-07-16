const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { Pool } = require('pg');
const Joi = require('joi');
const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: {
        message: 'Access token required',
        status: 401
      }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: {
          message: 'Invalid or expired token',
          status: 403
        }
      });
    }
    req.user = user;
    next();
  });
};

// Validation schema for music generation
const musicGenerationSchema = Joi.object({
  mood: Joi.string().valid('calm', 'energetic', 'sad', 'happy', 'anxious', 'peaceful').required(),
  genre: Joi.string().valid('ambient', 'classical', 'nature', 'binaural', 'meditation').optional(),
  duration: Joi.number().integer().min(30).max(600).default(120), // 30 seconds to 10 minutes
  tempo: Joi.string().valid('slow', 'medium', 'fast').optional(),
  instruments: Joi.array().items(Joi.string()).optional(),
  personalPreferences: Joi.object().optional()
});

// Generate therapeutic music
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { error, value } = musicGenerationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: {
          message: error.details[0].message,
          status: 400
        }
      });
    }

    const { mood, genre, duration, tempo, instruments, personalPreferences } = value;

    // Get user's previous preferences and mood history
    const userPreferences = await pool.query(
      'SELECT preferences FROM users WHERE id = $1',
      [req.user.userId]
    );

    const recentMoodEntries = await pool.query(
      `SELECT mood_score, energy_level, stress_level 
             FROM mood_entries 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT 5`,
      [req.user.userId]
    );

    // Prepare AI service request
    const aiRequest = {
      mood,
      genre,
      duration,
      tempo,
      instruments,
      personalPreferences: {
        ...personalPreferences,
        userPreferences: userPreferences.rows[0]?.preferences,
        recentMoodHistory: recentMoodEntries.rows
      }
    };

    // Call AI service to generate music
    const aiResponse = await axios.post(
      `${process.env.AI_SERVICE_URL}/music/generate`,
      aiRequest,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    const musicData = aiResponse.data;

    // Save generation record to database
    const result = await pool.query(
      `INSERT INTO music_generations (user_id, mood, genre, duration, tempo, instruments, 
                                         ai_model_used, generated_file_path, metadata, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
             RETURNING id, created_at`,
      [
        req.user.userId,
        mood,
        genre,
        duration,
        tempo,
        JSON.stringify(instruments),
        musicData.model_used,
        musicData.file_path,
        JSON.stringify(musicData.metadata)
      ]
    );

    res.json({
      message: 'Music generated successfully',
      music: {
        id: result.rows[0].id,
        mood,
        genre,
        duration,
        tempo,
        instruments,
        audioUrl: musicData.audio_url,
        metadata: musicData.metadata,
        createdAt: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Music generation error:', error);
        
    if (error.response) {
      // AI service returned an error
      res.status(error.response.status).json({
        error: {
          message: error.response.data.message || 'AI service error',
          status: error.response.status
        }
      });
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: {
          message: 'AI service unavailable',
          status: 503
        }
      });
    } else {
      res.status(500).json({
        error: {
          message: 'Internal server error during music generation',
          status: 500
        }
      });
    }
  }
});

// Get user's generated music history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT id, mood, genre, duration, tempo, instruments, ai_model_used, 
                    generated_file_path, metadata, created_at
             FROM music_generations 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2 OFFSET $3`,
      [req.user.userId, limit, offset]
    );

    const totalCount = await pool.query(
      'SELECT COUNT(*) FROM music_generations WHERE user_id = $1',
      [req.user.userId]
    );

    res.json({
      music: result.rows.map(row => ({
        id: row.id,
        mood: row.mood,
        genre: row.genre,
        duration: row.duration,
        tempo: row.tempo,
        instruments: row.instruments,
        modelUsed: row.ai_model_used,
        audioUrl: row.generated_file_path,
        metadata: row.metadata,
        createdAt: row.created_at
      })),
      pagination: {
        page,
        limit,
        total: parseInt(totalCount.rows[0].count),
        totalPages: Math.ceil(parseInt(totalCount.rows[0].count) / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching music history:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// Get specific generated music
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, mood, genre, duration, tempo, instruments, ai_model_used, 
                    generated_file_path, metadata, created_at
             FROM music_generations 
             WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'Music generation not found',
          status: 404
        }
      });
    }

    const music = result.rows[0];
    res.json({
      music: {
        id: music.id,
        mood: music.mood,
        genre: music.genre,
        duration: music.duration,
        tempo: music.tempo,
        instruments: music.instruments,
        modelUsed: music.ai_model_used,
        audioUrl: music.generated_file_path,
        metadata: music.metadata,
        createdAt: music.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching music:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// Rate music generation
router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
        
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: {
          message: 'Rating must be between 1 and 5',
          status: 400
        }
      });
    }

    await pool.query(
      `UPDATE music_generations 
             SET rating = $1, feedback = $2, updated_at = NOW()
             WHERE id = $3 AND user_id = $4`,
      [rating, feedback, req.params.id, req.user.userId]
    );

    res.json({
      message: 'Rating submitted successfully'
    });

  } catch (error) {
    console.error('Error rating music:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

module.exports = router;
