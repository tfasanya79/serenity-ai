const express = require('express');
const jwt = require('jsonwebtoken');
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

// Validation schema for mood entry
const moodEntrySchema = Joi.object({
  moodScore: Joi.number().min(1).max(10).required(),
  energyLevel: Joi.number().min(1).max(10).required(),
  stressLevel: Joi.number().min(1).max(10).required(),
  anxietyLevel: Joi.number().min(1).max(10).optional(),
  emotions: Joi.array().items(Joi.string().valid(
    'happy', 'sad', 'anxious', 'calm', 'angry', 'excited', 
    'peaceful', 'frustrated', 'hopeful', 'overwhelmed', 'content'
  )).required(),
  notes: Joi.string().max(500).optional(),
  triggers: Joi.array().items(Joi.string()).optional(),
  activities: Joi.array().items(Joi.string()).optional()
});

// Record mood entry
router.post('/entry', authenticateToken, async (req, res) => {
  try {
    const { error, value } = moodEntrySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: {
          message: error.details[0].message,
          status: 400
        }
      });
    }

    const { 
      moodScore, 
      energyLevel, 
      stressLevel, 
      anxietyLevel, 
      emotions, 
      notes, 
      triggers, 
      activities 
    } = value;

    const result = await pool.query(
      `INSERT INTO mood_entries (user_id, mood_score, energy_level, stress_level, 
                                     anxiety_level, emotions, notes, triggers, activities, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
             RETURNING id, created_at`,
      [
        req.user.userId,
        moodScore,
        energyLevel,
        stressLevel,
        anxietyLevel,
        JSON.stringify(emotions),
        notes,
        JSON.stringify(triggers || []),
        JSON.stringify(activities || [])
      ]
    );

    res.status(201).json({
      message: 'Mood entry recorded successfully',
      moodEntry: {
        id: result.rows[0].id,
        moodScore,
        energyLevel,
        stressLevel,
        anxietyLevel,
        emotions,
        notes,
        triggers,
        activities,
        createdAt: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Error recording mood entry:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// Get mood history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const offset = (page - 1) * limit;
    const days = parseInt(req.query.days) || 30;

    const result = await pool.query(
      `SELECT id, mood_score, energy_level, stress_level, anxiety_level, 
                    emotions, notes, triggers, activities, created_at
             FROM mood_entries 
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
             ORDER BY created_at DESC 
             LIMIT $2 OFFSET $3`,
      [req.user.userId, limit, offset]
    );

    const totalCount = await pool.query(
      `SELECT COUNT(*) FROM mood_entries 
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'`,
      [req.user.userId]
    );

    res.json({
      moodEntries: result.rows.map(row => ({
        id: row.id,
        moodScore: row.mood_score,
        energyLevel: row.energy_level,
        stressLevel: row.stress_level,
        anxietyLevel: row.anxiety_level,
        emotions: row.emotions,
        notes: row.notes,
        triggers: row.triggers,
        activities: row.activities,
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
    console.error('Error fetching mood history:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// Get mood analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;

    // Average scores
    const averages = await pool.query(
      `SELECT 
                AVG(mood_score) as avg_mood,
                AVG(energy_level) as avg_energy,
                AVG(stress_level) as avg_stress,
                AVG(anxiety_level) as avg_anxiety
             FROM mood_entries 
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'`,
      [req.user.userId]
    );

    // Mood trends (daily averages)
    const trends = await pool.query(
      `SELECT 
                DATE(created_at) as date,
                AVG(mood_score) as avg_mood,
                AVG(energy_level) as avg_energy,
                AVG(stress_level) as avg_stress,
                AVG(anxiety_level) as avg_anxiety,
                COUNT(*) as entry_count
             FROM mood_entries 
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
             GROUP BY DATE(created_at)
             ORDER BY date`,
      [req.user.userId]
    );

    // Most common emotions
    const emotions = await pool.query(
      `SELECT 
                emotion,
                COUNT(*) as frequency
             FROM mood_entries 
             CROSS JOIN JSON_ARRAY_ELEMENTS_TEXT(emotions) AS emotion
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
             GROUP BY emotion
             ORDER BY frequency DESC
             LIMIT 10`,
      [req.user.userId]
    );

    // Common triggers
    const triggers = await pool.query(
      `SELECT 
                trigger,
                COUNT(*) as frequency
             FROM mood_entries 
             CROSS JOIN JSON_ARRAY_ELEMENTS_TEXT(triggers) AS trigger
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
             GROUP BY trigger
             ORDER BY frequency DESC
             LIMIT 10`,
      [req.user.userId]
    );

    res.json({
      analytics: {
        averages: {
          mood: parseFloat(averages.rows[0].avg_mood || 0).toFixed(1),
          energy: parseFloat(averages.rows[0].avg_energy || 0).toFixed(1),
          stress: parseFloat(averages.rows[0].avg_stress || 0).toFixed(1),
          anxiety: parseFloat(averages.rows[0].avg_anxiety || 0).toFixed(1)
        },
        trends: trends.rows.map(row => ({
          date: row.date,
          avgMood: parseFloat(row.avg_mood || 0).toFixed(1),
          avgEnergy: parseFloat(row.avg_energy || 0).toFixed(1),
          avgStress: parseFloat(row.avg_stress || 0).toFixed(1),
          avgAnxiety: parseFloat(row.avg_anxiety || 0).toFixed(1),
          entryCount: parseInt(row.entry_count)
        })),
        topEmotions: emotions.rows,
        topTriggers: triggers.rows
      }
    });

  } catch (error) {
    console.error('Error fetching mood analytics:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// Get mood insights and recommendations
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;

    // Get recent mood patterns
    const recentMoods = await pool.query(
      `SELECT mood_score, energy_level, stress_level, anxiety_level, emotions, triggers, created_at
             FROM mood_entries 
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
             ORDER BY created_at DESC`,
      [req.user.userId]
    );

    // Calculate trends
    const moodData = recentMoods.rows;
    const insights = [];

    if (moodData.length > 0) {
      // Mood trend analysis
      const avgMood = moodData.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.length;
      const avgStress = moodData.reduce((sum, entry) => sum + entry.stress_level, 0) / moodData.length;
      const avgEnergy = moodData.reduce((sum, entry) => sum + entry.energy_level, 0) / moodData.length;

      if (avgMood < 4) {
        insights.push({
          type: 'concern',
          title: 'Low Mood Pattern',
          message: 'Your mood has been lower than usual. Consider engaging in activities that typically boost your mood.',
          recommendations: ['Practice mindfulness', 'Listen to uplifting music', 'Engage in physical activity']
        });
      }

      if (avgStress > 7) {
        insights.push({
          type: 'warning',
          title: 'High Stress Levels',
          message: 'Your stress levels have been elevated. Try stress-reduction techniques.',
          recommendations: ['Deep breathing exercises', 'Generate calming music', 'Practice progressive muscle relaxation']
        });
      }

      if (avgEnergy < 4) {
        insights.push({
          type: 'info',
          title: 'Low Energy',
          message: 'Your energy levels seem low. Consider activities that can help boost your energy.',
          recommendations: ['Light exercise', 'Energizing music', 'Adequate sleep', 'Proper nutrition']
        });
      }

      // Positive reinforcement
      if (avgMood > 7) {
        insights.push({
          type: 'positive',
          title: 'Great Mood Trend',
          message: 'Your mood has been consistently positive. Keep up the good work!',
          recommendations: ['Continue current activities', 'Share your success strategies', 'Maintain your routine']
        });
      }
    }

    res.json({
      insights,
      period: `${days} days`,
      dataPoints: moodData.length
    });

  } catch (error) {
    console.error('Error fetching mood insights:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

// Update mood entry
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { error, value } = moodEntrySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: {
          message: error.details[0].message,
          status: 400
        }
      });
    }

    const { 
      moodScore, 
      energyLevel, 
      stressLevel, 
      anxietyLevel, 
      emotions, 
      notes, 
      triggers, 
      activities 
    } = value;

    const result = await pool.query(
      `UPDATE mood_entries 
             SET mood_score = $1, energy_level = $2, stress_level = $3, anxiety_level = $4,
                 emotions = $5, notes = $6, triggers = $7, activities = $8, updated_at = NOW()
             WHERE id = $9 AND user_id = $10
             RETURNING id, created_at, updated_at`,
      [
        moodScore,
        energyLevel,
        stressLevel,
        anxietyLevel,
        JSON.stringify(emotions),
        notes,
        JSON.stringify(triggers || []),
        JSON.stringify(activities || []),
        req.params.id,
        req.user.userId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: 'Mood entry not found',
          status: 404
        }
      });
    }

    res.json({
      message: 'Mood entry updated successfully',
      moodEntry: {
        id: result.rows[0].id,
        moodScore,
        energyLevel,
        stressLevel,
        anxietyLevel,
        emotions,
        notes,
        triggers,
        activities,
        createdAt: result.rows[0].created_at,
        updatedAt: result.rows[0].updated_at
      }
    });

  } catch (error) {
    console.error('Error updating mood entry:', error);
    res.status(500).json({
      error: {
        message: 'Internal server error',
        status: 500
      }
    });
  }
});

module.exports = router;
