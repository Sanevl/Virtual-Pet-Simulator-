const express = require('express');
const database = require('../config/database');
const PetModel = require('../models/Pet');

const router = express.Router();
const petModel = new PetModel(database);

// Get pet data
router.get('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const petData = database.getPetByUserId(userId);
        
        if (!petData) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }
        
        res.json({
            success: true,
            pet: petData
        });
        
    } catch (error) {
        console.error('Get pet error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Update pet data
router.put('/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        
        const updatedPet = petModel.update(userId, updates);
        
        if (!updatedPet) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }
        
        res.json({
            success: true,
            pet: updatedPet
        });
        
    } catch (error) {
        console.error('Update pet error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Feed pet
router.post('/:userId/feed', (req, res) => {
    try {
        const { userId } = req.params;
        const updatedPet = petModel.feed(userId);
        
        if (!updatedPet) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Pet fed successfully',
            pet: updatedPet
        });
        
    } catch (error) {
        console.error('Feed pet error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Play with pet
router.post('/:userId/play', (req, res) => {
    try {
        const { userId } = req.params;
        const updatedPet = petModel.play(userId);
        
        if (!updatedPet) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Played with pet successfully',
            pet: updatedPet
        });
        
    } catch (error) {
        console.error('Play with pet error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Put pet to sleep
router.post('/:userId/sleep', (req, res) => {
    try {
        const { userId } = req.params;
        const updatedPet = petModel.sleep(userId);
        
        if (!updatedPet) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Pet is now sleeping',
            pet: updatedPet
        });
        
    } catch (error) {
        console.error('Sleep pet error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Clean pet
router.post('/:userId/clean', (req, res) => {
    try {
        const { userId } = req.params;
        const updatedPet = petModel.clean(userId);
        
        if (!updatedPet) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Pet cleaned successfully',
            pet: updatedPet
        });
        
    } catch (error) {
        console.error('Clean pet error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Change pet type
router.post('/:userId/change-type', (req, res) => {
    try {
        const { userId } = req.params;
        const { type } = req.body;
        
        if (!type) {
            return res.status(400).json({ 
                success: false, 
                message: 'Pet type is required' 
            });
        }
        
        const updatedPet = petModel.changeType(userId, type);
        
        if (!updatedPet) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Pet type changed successfully',
            pet: updatedPet
        });
        
    } catch (error) {
        console.error('Change pet type error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Internal server error' 
        });
    }
});

// Record night interaction
router.post('/:userId/night-interaction', (req, res) => {
    try {
        const { userId } = req.params;
        const updatedPet = petModel.recordNightInteraction(userId);
        
        if (!updatedPet) {
            return res.status(404).json({ 
                success: false, 
                message: 'Pet not found' 
            });
        }
        
        res.json({
            success: true,
            message: 'Night interaction recorded',
            pet: updatedPet
        });
        
    } catch (error) {
        console.error('Night interaction error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

module.exports = router;