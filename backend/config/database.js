// In-memory database simulation
// In a real application, this would connect to MongoDB, PostgreSQL, etc.

class Database {
    constructor() {
        this.users = new Map();
        this.pets = new Map();
        this.sessions = new Map();
    }

    // User methods
    createUser(userData) {
        const user = {
            id: userData.id,
            username: userData.username.toLowerCase(),
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        this.users.set(user.username, user);
        return user;
    }

    getUserByUsername(username) {
        return this.users.get(username.toLowerCase());
    }

    getUserById(userId) {
        return Array.from(this.users.values()).find(user => user.id === userId);
    }

    updateUserLogin(username) {
        const user = this.getUserByUsername(username);
        if (user) {
            user.lastLogin = new Date().toISOString();
        }
        return user;
    }

    // Pet methods
    createPet(petData) {
        const pet = {
            userId: petData.userId,
            hunger: 50,
            happiness: 70,
            energy: 60,
            level: 1,
            experience: 0,
            type: 'cat',
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
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...petData
        };
        this.pets.set(pet.userId, pet);
        return pet;
    }

    getPetByUserId(userId) {
        return this.pets.get(userId);
    }

    updatePet(userId, updates) {
        const pet = this.getPetByUserId(userId);
        if (pet) {
            Object.assign(pet, updates);
            pet.updatedAt = new Date().toISOString();
            return pet;
        }
        return null;
    }

    // Leaderboard methods
    getLeaderboard(limit = 10) {
        return Array.from(this.pets.values())
            .map(pet => {
                const user = this.getUserById(pet.userId);
                return {
                    username: user ? user.username : 'Unknown',
                    level: pet.level,
                    happiness: pet.happiness,
                    totalInteractions: pet.totalInteractions,
                    playTime: pet.playTime,
                    type: pet.type
                };
            })
            .sort((a, b) => b.level - a.level || b.happiness - a.happiness)
            .slice(0, limit);
    }

    // Statistics
    getGlobalStats() {
        const pets = Array.from(this.pets.values());
        return {
            totalUsers: this.users.size,
            totalPets: pets.length,
            averageLevel: pets.reduce((sum, pet) => sum + pet.level, 0) / pets.length || 0,
            totalInteractions: pets.reduce((sum, pet) => sum + pet.totalInteractions, 0),
            mostPopularPet: this.getMostPopularPetType()
        };
    }

    getMostPopularPetType() {
        const pets = Array.from(this.pets.values());
        const typeCount = {};
        pets.forEach(pet => {
            typeCount[pet.type] = (typeCount[pet.type] || 0) + 1;
        });
        
        return Object.entries(typeCount)
            .sort(([,a], [,b]) => b - a)[0] || ['cat', 0];
    }
}

// Create and export a single database instance
const database = new Database();
module.exports = database;