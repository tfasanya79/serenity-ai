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

// Validation schema for therapy session
const therapySessionSchema = Joi.object({
    sessionType: Joi.string().valid('music', 'art', 'combined', 'guided').required(),
    duration: Joi.number().integer().min(5).max(120).default(30), // 5 minutes to 2 hours
    goals: Joi.array().items(Joi.string().valid(
        'stress_reduction', 'mood_improvement', 'anxiety_relief', 
        'emotional_regulation', 'self_expression', 'mindfulness'
    )).required(),
    preferences: Joi.object().optional()
});

// Start therapy session
router.post('/session/start', authenticateToken, async (req, res) => {
    try {
        const { error, value } = therapySessionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: {
                    message: error.details[0].message,
                    status: 400
                }
            });
        }

        const { sessionType, duration, goals, preferences } = value;

        // Get user's recent mood data and therapy history
        const userMoodData = await pool.query(
            `SELECT mood_score, energy_level, stress_level, anxiety_level, emotions
             FROM mood_entries 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT 5`,
            [req.user.userId]
        );

        const therapyHistory = await pool.query(
            `SELECT session_type, goals, rating, feedback
             FROM therapy_sessions 
             WHERE user_id = $1 AND rating >= 4
             ORDER BY created_at DESC 
             LIMIT 3`,
            [req.user.userId]
        );

        // Get user preferences
        const userPreferences = await pool.query(
            `SELECT preferences, mental_health_goals FROM users WHERE id = $1`,
            [req.user.userId]
        );

        // Create therapy session record
        const sessionResult = await pool.query(
            `INSERT INTO therapy_sessions (user_id, session_type, duration, goals, preferences, 
                                         status, started_at, created_at)
             VALUES ($1, $2, $3, $4, $5, 'active', NOW(), NOW())
             RETURNING id, started_at`,
            [
                req.user.userId,
                sessionType,
                duration,
                JSON.stringify(goals),
                JSON.stringify(preferences || {})
            ]
        );

        const sessionId = sessionResult.rows[0].id;

        // Generate personalized therapy plan
        const therapyPlan = await generateTherapyPlan({
            sessionId,
            sessionType,
            duration,
            goals,
            preferences,
            userMoodData: userMoodData.rows,
            therapyHistory: therapyHistory.rows,
            userPreferences: userPreferences.rows[0]
        });

        res.json({
            message: 'Therapy session started successfully',
            session: {
                id: sessionId,
                sessionType,
                duration,
                goals,
                preferences,
                plan: therapyPlan,
                startedAt: sessionResult.rows[0].started_at
            }
        });

    } catch (error) {
        console.error('Error starting therapy session:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

// Generate personalized therapy plan
async function generateTherapyPlan(sessionData) {
    const { sessionType, duration, goals, userMoodData, therapyHistory } = sessionData;
    
    const plan = {
        phases: [],
        totalDuration: duration,
        recommendations: []
    };

    // Phase 1: Initial assessment and grounding (5-10 minutes)
    plan.phases.push({
        name: 'Grounding & Assessment',
        duration: Math.min(10, duration * 0.2),
        activities: [
            {
                type: 'breathing_exercise',
                duration: 3,
                description: 'Deep breathing to center yourself'
            },
            {
                type: 'mood_check',
                duration: 2,
                description: 'Quick mood assessment'
            }
        ]
    });

    // Phase 2: Core therapeutic activity
    const coreActivityDuration = duration * 0.6;
    if (sessionType === 'music' || sessionType === 'combined') {
        plan.phases.push({
            name: 'Music Therapy',
            duration: coreActivityDuration,
            activities: [
                {
                    type: 'music_generation',
                    duration: coreActivityDuration * 0.3,
                    description: 'Generate personalized therapeutic music'
                },
                {
                    type: 'active_listening',
                    duration: coreActivityDuration * 0.7,
                    description: 'Mindful listening and emotional processing'
                }
            ]
        });
    }

    if (sessionType === 'art' || sessionType === 'combined') {
        plan.phases.push({
            name: 'Art Therapy',
            duration: coreActivityDuration,
            activities: [
                {
                    type: 'art_generation',
                    duration: coreActivityDuration * 0.4,
                    description: 'Create therapeutic visual art'
                },
                {
                    type: 'art_reflection',
                    duration: coreActivityDuration * 0.6,
                    description: 'Reflect on the created art and emotions'
                }
            ]
        });
    }

    // Phase 3: Integration and reflection (10-20% of session)
    plan.phases.push({
        name: 'Integration & Reflection',
        duration: duration * 0.2,
        activities: [
            {
                type: 'journaling',
                duration: duration * 0.1,
                description: 'Write about your experience'
            },
            {
                type: 'goal_setting',
                duration: duration * 0.1,
                description: 'Set intentions for moving forward'
            }
        ]
    });

    // Generate recommendations based on mood data
    if (userMoodData.length > 0) {
        const avgStress = userMoodData.reduce((sum, entry) => sum + entry.stress_level, 0) / userMoodData.length;
        const avgMood = userMoodData.reduce((sum, entry) => sum + entry.mood_score, 0) / userMoodData.length;

        if (avgStress > 7) {
            plan.recommendations.push('Focus on stress-reduction techniques');
            plan.recommendations.push('Consider shorter, more frequent sessions');
        }

        if (avgMood < 4) {
            plan.recommendations.push('Engage with uplifting content');
            plan.recommendations.push('Practice self-compassion exercises');
        }
    }

    return plan;
}

// Get therapy session details
router.get('/session/:id', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, session_type, duration, goals, preferences, status, 
                    started_at, ended_at, rating, feedback, created_at
             FROM therapy_sessions 
             WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: {
                    message: 'Therapy session not found',
                    status: 404
                }
            });
        }

        const session = result.rows[0];
        res.json({
            session: {
                id: session.id,
                sessionType: session.session_type,
                duration: session.duration,
                goals: session.goals,
                preferences: session.preferences,
                status: session.status,
                startedAt: session.started_at,
                endedAt: session.ended_at,
                rating: session.rating,
                feedback: session.feedback,
                createdAt: session.created_at
            }
        });

    } catch (error) {
        console.error('Error fetching therapy session:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

// End therapy session
router.post('/session/:id/end', authenticateToken, async (req, res) => {
    try {
        const { rating, feedback, achievements } = req.body;

        const result = await pool.query(
            `UPDATE therapy_sessions 
             SET status = 'completed', ended_at = NOW(), rating = $1, feedback = $2, 
                 achievements = $3, updated_at = NOW()
             WHERE id = $4 AND user_id = $5 AND status = 'active'
             RETURNING id, ended_at`,
            [rating, feedback, JSON.stringify(achievements || []), req.params.id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: {
                    message: 'Active therapy session not found',
                    status: 404
                }
            });
        }

        res.json({
            message: 'Therapy session ended successfully',
            session: {
                id: result.rows[0].id,
                endedAt: result.rows[0].ended_at
            }
        });

    } catch (error) {
        console.error('Error ending therapy session:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

// Get therapy history
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            `SELECT id, session_type, duration, goals, status, started_at, ended_at, 
                    rating, feedback, created_at
             FROM therapy_sessions 
             WHERE user_id = $1 
             ORDER BY created_at DESC 
             LIMIT $2 OFFSET $3`,
            [req.user.userId, limit, offset]
        );

        const totalCount = await pool.query(
            'SELECT COUNT(*) FROM therapy_sessions WHERE user_id = $1',
            [req.user.userId]
        );

        res.json({
            sessions: result.rows.map(row => ({
                id: row.id,
                sessionType: row.session_type,
                duration: row.duration,
                goals: row.goals,
                status: row.status,
                startedAt: row.started_at,
                endedAt: row.ended_at,
                rating: row.rating,
                feedback: row.feedback,
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
        console.error('Error fetching therapy history:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

// Get therapy analytics
router.get('/analytics', authenticateToken, async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;

        // Session statistics
        const sessionStats = await pool.query(
            `SELECT 
                COUNT(*) as total_sessions,
                AVG(duration) as avg_duration,
                AVG(rating) as avg_rating,
                session_type,
                COUNT(*) as type_count
             FROM therapy_sessions 
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
             GROUP BY session_type`,
            [req.user.userId]
        );

        // Goal progress
        const goalProgress = await pool.query(
            `SELECT 
                goal,
                COUNT(*) as sessions_count,
                AVG(rating) as avg_rating
             FROM therapy_sessions 
             CROSS JOIN JSON_ARRAY_ELEMENTS_TEXT(goals) AS goal
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
             GROUP BY goal
             ORDER BY sessions_count DESC`,
            [req.user.userId]
        );

        // Weekly trends
        const weeklyTrends = await pool.query(
            `SELECT 
                DATE_TRUNC('week', created_at) as week,
                COUNT(*) as session_count,
                AVG(rating) as avg_rating,
                AVG(duration) as avg_duration
             FROM therapy_sessions 
             WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '${days} days'
             GROUP BY week
             ORDER BY week`,
            [req.user.userId]
        );

        res.json({
            analytics: {
                sessionStats: sessionStats.rows,
                goalProgress: goalProgress.rows,
                weeklyTrends: weeklyTrends.rows.map(row => ({
                    week: row.week,
                    sessionCount: parseInt(row.session_count),
                    avgRating: parseFloat(row.avg_rating || 0).toFixed(1),
                    avgDuration: parseFloat(row.avg_duration || 0).toFixed(1)
                }))
            }
        });

    } catch (error) {
        console.error('Error fetching therapy analytics:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error',
                status: 500
            }
        });
    }
});

module.exports = router;
