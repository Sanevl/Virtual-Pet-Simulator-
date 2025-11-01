const express = require('express');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const PetModel = require('../models/Pet');

const router = express.Router();
const petModel = new PetModel(database);

// User login/registration
router.post('/login', (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username || username.trim().length < 3) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username must be at least 3 characters long' 
            });
        }
        
        const normalizedUsername = username.trim().toLowerCase();
        let user = database.getUserByUsername(normalizedUsername);
        
        if (!user) {
            // Create new user
            const userId = uuidv4();
            user = database.createUser({
                id: userId,
                username: normalizedUsername
            });
            
            // Create initial pet
            petModel.create(userId);
        } else {
            // Update last login for existing user
            database.updateUserLogin(normalizedUsername);
        }
        
        const petData = database.getPetByUserId(user.id);
        
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username
            },
            pet: petData
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error during login' 
        });
    }
});

// Get user profile
router.get('/profile/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const user = database.getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        const pet = database.getPetByUserId(userId);
        
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            },
            pet: pet
        });
        
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

module.exports = router;