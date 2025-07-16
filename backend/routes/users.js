const express = require('express');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
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

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, email, first_name, last_name, age, mental_health_goals, 
                    created_at, updated_at, preferences 
             FROM users WHERE id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: {
                    message: 'User not found',
                    status: 404
                }
            });
        }

        const user = result.rows[0];
        res.json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                age: user.age,
                mentalHealthGoals: user.mental_health_goals,
                preferences: user.preferences,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            }
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        const { firstName, lastName, age, mentalHealthGoals, preferences } = req.body;
        
        const result = await pool.query(
            `UPDATE users 
             SET first_name = COALESCE($1, first_name),
                 last_name = COALESCE($2, last_name),
                 age = COALESCE($3, age),
                 mental_health_goals = COALESCE($4, mental_health_goals),
                 preferences = COALESCE($5, preferences),
                 updated_at = NOW()
             WHERE id = $6
             RETURNING id, email, first_name, last_name, age, mental_health_goals, preferences, updated_at`,
            [firstName, lastName, age, JSON.stringify(mentalHealthGoals), JSON.stringify(preferences), req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: {
                    message: 'User not found',
                    status: 404
                }
            });
        }

        const user = result.rows[0];
        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                age: user.age,
                mentalHealthGoals: user.mental_health_goals,
                preferences: user.preferences,
                updatedAt: user.updated_at
            }
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const musicCount = await pool.query(
            'SELECT COUNT(*) FROM music_generations WHERE user_id = $1',
            [req.user.userId]
        );

        const artCount = await pool.query(
            'SELECT COUNT(*) FROM art_generations WHERE user_id = $1',
            [req.user.userId]
        );

        const moodEntries = await pool.query(
            'SELECT COUNT(*) FROM mood_entries WHERE user_id = $1',
            [req.user.userId]
        );

        const therapySessions = await pool.query(
            'SELECT COUNT(*) FROM therapy_sessions WHERE user_id = $1',
            [req.user.userId]
        );

        res.json({
            stats: {
                musicGenerations: parseInt(musicCount.rows[0].count),
                artGenerations: parseInt(artCount.rows[0].count),
                moodEntries: parseInt(moodEntries.rows[0].count),
                therapySessions: parseInt(therapySessions.rows[0].count)
            }
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

module.exports = router;
