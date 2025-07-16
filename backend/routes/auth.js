const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Pool } = require('pg');
const router = express.Router();

// Database connection (you'll need to implement proper database setup)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// Validation schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    age: Joi.number().integer().min(13).max(120).optional(),
    mentalHealthGoals: Joi.array().items(Joi.string()).optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: {
                    message: error.details[0].message,
                    status: 400
                }
            });
        }

        const { email, password, firstName, lastName, age, mentalHealthGoals } = value;

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: {
                    message: 'User with this email already exists',
                    status: 409
                }
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const result = await pool.query(
            `INSERT INTO users (email, password, first_name, last_name, age, mental_health_goals, created_at, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) 
             RETURNING id, email, first_name, last_name, age, created_at`,
            [email, hashedPassword, firstName, lastName, age, JSON.stringify(mentalHealthGoals || [])]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                age: user.age,
                createdAt: user.created_at
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error during registration',
                status: 500
            }
        });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: {
                    message: error.details[0].message,
                    status: 400
                }
            });
        }

        const { email, password } = value;

        // Find user
        const result = await pool.query(
            'SELECT id, email, password, first_name, last_name, age, created_at FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: {
                    message: 'Invalid credentials',
                    status: 401
                }
            });
        }

        const user = result.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: {
                    message: 'Invalid credentials',
                    status: 401
                }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                age: user.age,
                createdAt: user.created_at
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: {
                message: 'Internal server error during login',
                status: 500
            }
        });
    }
});

// Token validation middleware
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

// Verify token endpoint
router.get('/verify', authenticateToken, (req, res) => {
    res.json({
        message: 'Token is valid',
        user: req.user
    });
});

// Logout endpoint (client-side token removal)
router.post('/logout', (req, res) => {
    res.json({
        message: 'Logged out successfully'
    });
});

module.exports = router;
