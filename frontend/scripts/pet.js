class VirtualPet {
    constructor() {
        this.hunger = 50;
        this.happiness = 70;
        this.energy = 60;
        this.type = 'cat';
        this.level = 1;
        this.experience = 0;
        this.isSleeping = false;
        this.lastUpdate = Date.now();
        this.playCount = 0;
        this.feedCount = 0;
        this.sleepCount = 0;
        this.nightInteractions = 0;
        this.totalInteractions = 0;
        this.playTime = 0;
        this.startTime = Date.now();
    }

    feed() {
        if (this.hunger < 100) {
            this.hunger = Math.min(this.hunger + 15, 100);
            this.energy = Math.min(this.energy + 5, 100);
            this.happiness = Math.min(this.happiness + 5, 100);
            this.feedCount++;
            this.totalInteractions++;
            this.addExperience(5);
            return true;
        }
        return false;
    }

    play() {
        if (this.energy > 10 && !this.isSleeping) {
            this.happiness = Math.min(this.happiness + 15, 100);
            this.energy = Math.max(this.energy - 10, 0);
            this.hunger = Math.max(this.hunger - 5, 0);
            this.playCount++;
            this.totalInteractions++;
            this.addExperience(8);
            return true;
        }
        return false;
    }

    sleep() {
        if (this.energy < 100) {
            this.energy = Math.min(this.energy + 20, 100);
            this.hunger = Math.max(this.hunger - 10, 0);
            this.isSleeping = true;
            this.sleepCount++;
            this.totalInteractions++;
            this.addExperience(3);
            
            setTimeout(() => {
                this.isSleeping = false;
            }, 5000);
            
            return true;
        }
        return false;
    }

    clean() {
        this.happiness = Math.min(this.happiness + 10, 100);
        this.totalInteractions++;
        this.addExperience(2);
        return true;
    }

    addExperience(amount) {
        this.experience += amount;
        const neededExp = this.level * 50;
        if (this.experience >= neededExp) {
            this.level++;
            this.experience = 0;
            return true;
        }
        return false;
    }

    updateStats() {
        const now = Date.now();
        const elapsed = (now - this.lastUpdate) / 1000;
        this.lastUpdate = now;

        if (!this.isSleeping) {
            this.hunger = Math.max(this.hunger - elapsed * 0.1, 0);
            this.happiness = Math.max(this.happiness - elapsed * 0.05, 0);
            this.energy = Math.max(this.energy - elapsed * 0.07, 0);
        }

        this.playTime = Math.floor((now - this.startTime) / 1000 / 60);
    }

    getStatus() {
        return {
            hunger: Math.round(this.hunger),
            happiness: Math.round(this.happiness),
            energy: Math.round(this.energy),
            level: this.level,
            experience: this.experience,
            isSleeping: this.isSleeping,
            playCount: this.playCount,
            feedCount: this.feedCount,
            sleepCount: this.sleepCount,
            totalInteractions: this.totalInteractions,
            playTime: this.playTime
        };
    }

    setType(type) {
        this.type = type;
    }

    recordNightInteraction() {
        this.nightInteractions++;
    }
}