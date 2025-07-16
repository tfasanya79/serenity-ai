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

// Validation schema for art generation
const artGenerationSchema = Joi.object({
    mood: Joi.string().valid('calm', 'energetic', 'sad', 'happy', 'anxious', 'peaceful', 'creative').required(),
    artStyle: Joi.string().valid('abstract', 'nature', 'geometric', 'watercolor', 'digital', 'minimalist').optional(),
    colorPalette: Joi.string().valid('warm', 'cool', 'neutral', 'vibrant', 'monochrome').optional(),
    theme: Joi.string().valid('healing', 'growth', 'peace', 'strength', 'hope', 'balance').optional(),
    prompt: Joi.string().max(500).optional(),
    personalPreferences: Joi.object().optional()
});

// Generate therapeutic art
router.post('/generate', authenticateToken, async (req, res) => {
    try {
        const { error, value } = artGenerationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: {
                    message: error.details[0].message,
                    status: 400
                }
            });
        }

        const { mood, artStyle, colorPalette, theme, prompt, personalPreferences } = value;

        // Get user's previous preferences and mood history
        const userPreferences = await pool.query(
            `SELECT preferences FROM users WHERE id = $1`,
            [req.user.userId]
        );

        const recentMoodEntries = await pool.query(
            `SELECT mood_score, energy_level, stress_level, emotions 
             FROM mood_entries 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [req.user.userId]
        );

        // Get recent art preferences
        const recentArtGenerations = await pool.query(
            `SELECT art_style, color_palette, theme, rating 
             FROM art_generations 
             WHERE user_id = $1 AND rating >= 4
             ORDER BY created_at DESC 
             LIMIT 3`,
            [req.user.userId]
        );

        // Prepare AI service request
        const aiRequest = {
            mood,
            artStyle,
            colorPalette,
            theme,
            prompt,
            personalPreferences: {
                ...personalPreferences,
                userPreferences: userPreferences.rows[0]?.preferences,
                recentMoodHistory: recentMoodEntries.rows,
                preferredStyles: recentArtGenerations.rows
            }
        };

        // Call AI service to generate art
        const aiResponse = await axios.post(
            `${process.env.AI_SERVICE_URL}/art/generate`,
            aiRequest,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 60000 // 60 seconds timeout for art generation
            }
        );

        const artData = aiResponse.data;

        // Save generation record to database
        const result = await pool.query(
            `INSERT INTO art_generations (user_id, mood, art_style, color_palette, theme, prompt,
                                        ai_model_used, generated_file_path, metadata, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
             RETURNING id, created_at`,
            [
                req.user.userId,
                mood,
                artStyle,
                colorPalette,
                theme,
                prompt,
                artData.model_used,
                artData.file_path,
                JSON.stringify(artData.metadata)
            ]
        );

        res.json({
            message: 'Art generated successfully',
            art: {
                id: result.rows[0].id,
                mood,
                artStyle,
                colorPalette,
                theme,
                prompt,
                imageUrl: artData.image_url,
                metadata: artData.metadata,
                createdAt: result.rows[0].created_at
            }
        });

    } catch (error) {
        console.error('Art generation error:', error);
        
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
                    message: 'Internal server error during art generation',
                    status: 500
                }
            });
        }
    }
});

// Get user's generated art history
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            `SELECT id, mood, art_style, color_palette, theme, prompt, ai_model_used, 
                    generated_file_path, metadata, rating, created_at
             FROM art_generations 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2 OFFSET $3`,
            [req.user.userId, limit, offset]
        );

        const totalCount = await pool.query(
            'SELECT COUNT(*) FROM art_generations WHERE user_id = $1',
            [req.user.userId]
        );

        res.json({
            art: result.rows.map(row => ({
                id: row.id,
                mood: row.mood,
                artStyle: row.art_style,
                colorPalette: row.color_palette,
                theme: row.theme,
                prompt: row.prompt,
                modelUsed: row.ai_model_used,
                imageUrl: row.generated_file_path,
                metadata: row.metadata,
                rating: row.rating,
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
        console.error('Error fetching art history:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

// Get specific generated art
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, mood, art_style, color_palette, theme, prompt, ai_model_used, 
                    generated_file_path, metadata, rating, feedback, created_at
             FROM art_generations 
             WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: {
                    message: 'Art generation not found',
                    status: 404
                }
            });
        }

        const art = result.rows[0];
        res.json({
            art: {
                id: art.id,
                mood: art.mood,
                artStyle: art.art_style,
                colorPalette: art.color_palette,
                theme: art.theme,
                prompt: art.prompt,
                modelUsed: art.ai_model_used,
                imageUrl: art.generated_file_path,
                metadata: art.metadata,
                rating: art.rating,
                feedback: art.feedback,
                createdAt: art.created_at
            }
        });

    } catch (error) {
        console.error('Error fetching art:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

// Rate art generation
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
            `UPDATE art_generations 
             SET rating = $1, feedback = $2, updated_at = NOW()
             WHERE id = $3 AND user_id = $4`,
            [rating, feedback, req.params.id, req.user.userId]
        );

        res.json({
            message: 'Rating submitted successfully'
        });

    } catch (error) {
        console.error('Error rating art:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

// Get art gallery (public showcase of user's favorite art)
router.get('/gallery/:userId', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, mood, art_style, color_palette, theme, generated_file_path, 
                    metadata, rating, created_at
             FROM art_generations 
             WHERE user_id = $1 AND rating >= 4 AND is_public = true
             ORDER BY created_at DESC 
             LIMIT 20`,
            [req.params.userId]
        );

        res.json({
            gallery: result.rows.map(row => ({
                id: row.id,
                mood: row.mood,
                artStyle: row.art_style,
                colorPalette: row.color_palette,
                theme: row.theme,
                imageUrl: row.generated_file_path,
                metadata: row.metadata,
                rating: row.rating,
                createdAt: row.created_at
            }))
        });

    } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

module.exports = router;
