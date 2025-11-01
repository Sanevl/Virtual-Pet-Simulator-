class PetModel {
    constructor(database) {
        this.db = database;
    }

    // Create a new pet for a user
    create(userId, petType = 'cat') {
        const petData = {
            userId,
            type: petType,
            hunger: 50,
            happiness: 70,
            energy: 60,
            level: 1,
            experience: 0,
            playCount: 0,
            feedCount: 0,
            sleepCount: 0,
            nightInteractions: 0,
            totalInteractions: 0,
            playTime: 0,
            achievements: {
                firstMeal: false,
                playful: false,
                goodNight: false,
                nightOwl: false
            }
        };
        
        return this.db.createPet(petData);
    }

    // Get pet by user ID
    getByUserId(userId) {
        return this.db.getPetByUserId(userId);
    }

    // Update pet attributes
    update(userId, updates) {
        // Validate updates
        const allowedFields = [
            'hunger', 'happiness', 'energy', 'level', 'experience',
            'type', 'playCount', 'feedCount', 'sleepCount', 'nightInteractions',
            'totalInteractions', 'playTime', 'achievements'
        ];
        
        const validUpdates = {};
        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                validUpdates[key] = updates[key];
            }
        });

        return this.db.updatePet(userId, validUpdates);
    }

    // Perform pet actions
    feed(userId) {
        const pet = this.getByUserId(userId);
        if (!pet) return null;

        const updates = {
            hunger: Math.min(pet.hunger + 15, 100),
            energy: Math.min(pet.energy + 5, 100),
            happiness: Math.min(pet.happiness + 5, 100),
            feedCount: pet.feedCount + 1,
            totalInteractions: pet.totalInteractions + 1,
            experience: pet.experience + 5
        };

        // Check for level up
        if (this.checkLevelUp(pet, updates.experience)) {
            updates.level = pet.level + 1;
            updates.experience = 0;
        }

        // Check for first meal achievement
        if (pet.feedCount === 0) {
            updates.achievements = { ...pet.achievements, firstMeal: true };
        }

        return this.update(userId, updates);
    }

    play(userId) {
        const pet = this.getByUserId(userId);
        if (!pet) return null;

        const updates = {
            happiness: Math.min(pet.happiness + 15, 100),
            energy: Math.max(pet.energy - 10, 0),
            hunger: Math.max(pet.hunger - 5, 0),
            playCount: pet.playCount + 1,
            totalInteractions: pet.totalInteractions + 1,
            experience: pet.experience + 8
        };

        // Check for level up
        if (this.checkLevelUp(pet, updates.experience)) {
            updates.level = pet.level + 1;
            updates.experience = 0;
        }

        // Check for playful achievement
        if (pet.playCount >= 4 && !pet.achievements.playful) { // 4 because we're about to add 1
            updates.achievements = { ...pet.achievements, playful: true };
        }

        return this.update(userId, updates);
    }

    sleep(userId) {
        const pet = this.getByUserId(userId);
        if (!pet) return null;

        const updates = {
            energy: Math.min(pet.energy + 20, 100),
            hunger: Math.max(pet.hunger - 10, 0),
            sleepCount: pet.sleepCount + 1,
            totalInteractions: pet.totalInteractions + 1,
            experience: pet.experience + 3
        };

        // Check for level up
        if (this.checkLevelUp(pet, updates.experience)) {
            updates.level = pet.level + 1;
            updates.experience = 0;
        }

        // Check for good night achievement
        if (pet.sleepCount >= 2 && !pet.achievements.goodNight) { // 2 because we're about to add 1
            updates.achievements = { ...pet.achievements, goodNight: true };
        }

        return this.update(userId, updates);
    }

    clean(userId) {
        const pet = this.getByUserId(userId);
        if (!pet) return null;

        const updates = {
            happiness: Math.min(pet.happiness + 10, 100),
            totalInteractions: pet.totalInteractions + 1,
            experience: pet.experience + 2
        };

        // Check for level up
        if (this.checkLevelUp(pet, updates.experience)) {
            updates.level = pet.level + 1;
            updates.experience = 0;
        }

        return this.update(userId, updates);
    }

    // Helper method to check for level up
    checkLevelUp(pet, newExperience) {
        const neededExp = pet.level * 50;
        return newExperience >= neededExp;
    }

    // Record night interaction
    recordNightInteraction(userId) {
        const pet = this.getByUserId(userId);
        if (!pet) return null;

        const updates = {
            nightInteractions: pet.nightInteractions + 1
        };

        // Check for night owl achievement
        if (pet.nightInteractions === 0 && !pet.achievements.nightOwl) {
            updates.achievements = { ...pet.achievements, nightOwl: true };
        }

        return this.update(userId, updates);
    }

    // Change pet type
    changeType(userId, newType) {
        const allowedTypes = ['cat', 'dog', 'rabbit', 'fox'];
        if (!allowedTypes.includes(newType)) {
            throw new Error('Invalid pet type');
        }

        return this.update(userId, { type: newType });
    }
}

module.exports = PetModel;