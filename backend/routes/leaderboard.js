const express = require('express');
const database = require('../config/database');

const router = express.Router();

// Get leaderboard
router.get('/', (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const leaderboard = database.getLeaderboard(parseInt(limit));
        
        res.json({
            success: true,
            leaderboard
        });
        
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Get global statistics
router.get('/stats', (req, res) => {
    try {
        const globalStats = database.getGlobalStats();
        
        res.json({
            success: true,
            stats: globalStats
        });
        
    } catch (error) {
        console.error('Global stats error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Get user statistics
router.get('/user/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const pet = database.getPetByUserId(userId);
        
        if (!pet) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }
        
        const user = database.getUserById(userId);
        const stats = {
            username: user ? user.username : 'Unknown',
            level: pet.level,
            totalInteractions: pet.totalInteractions,
            playTime: pet.playTime,
            feedCount: pet.feedCount,
            playCount: pet.playCount,
            sleepCount: pet.sleepCount,
            achievements: Object.keys(pet.achievements).filter(key => pet.achievements[key]).length,
            petType: pet.type
        };
        
        res.json({
            success: true,
            stats
        });
        
    } catch (error) {
        console.error('User stats error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

module.exports = router;