class GameManager {
    constructor() {
        this.pet = new VirtualPet();
        this.isDay = true;
        this.achievements = {
            firstMeal: false,
            playful: false,
            goodNight: false,
            nightOwl: false
        };
        this.isLoggedIn = false;
        this.currentUser = null;
        this.autoSaveInterval = null;
    }

    init() {
        this.setupEventListeners();
        this.startGameLoop();
        this.loadFromStorage();
    }

    setupEventListeners() {
        // Login/logout
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('username').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.login();
        });

        // Pet selection
        document.querySelectorAll('.pet-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const type = e.target.getAttribute('data-pet');
                this.selectPet(type);
            });
        });

        // Action buttons
        document.getElementById('feed-btn').addEventListener('click', () => this.feedPet());
        document.getElementById('play-btn').addEventListener('click', () => this.playWithPet());
        document.getElementById('sleep-btn').addEventListener('click', () => this.putPetToSleep());
        document.getElementById('clean-btn').addEventListener('click', () => this.cleanPet());
    }

    login() {
        const username = document.getElementById('username').value.trim();
        if (!username) {
            alert('Please enter a username!');
            return;
        }

        this.currentUser = username;
        this.isLoggedIn = true;
        
        // Show user info and enable buttons
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('current-user').textContent = username;
        
        // Enable action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.add('active');
        });

        this.petMessage('Welcome! Your pet is ready to play!');
        this.startAutoSave();
        this.saveToStorage();
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        
        // Show login section
        document.getElementById('login-section').classList.remove('hidden');
        document.getElementById('user-info').classList.add('hidden');
        document.getElementById('username').value = '';
        
        // Disable action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        this.petMessage('Please login to start playing!');
        this.stopAutoSave();
    }

    selectPet(type) {
        if (!this.isLoggedIn) return;

        this.pet.setType(type);
        
        // Update UI
        document.querySelectorAll('.pet-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`.pet-option[data-pet="${type}"]`).classList.add('active');
        
        this.updatePetAppearance();
        this.saveToStorage();
    }

    feedPet() {
        if (!this.isLoggedIn) return;

        const success = this.pet.feed();
        if (success) {
            this.petMessage("Yum! That was delicious!");
            
            // Check for first meal achievement
            if (this.pet.feedCount === 1) {
                this.unlockAchievement('firstMeal');
            }
        } else {
            this.petMessage("I'm too full to eat right now!");
        }
        
        this.updateUI();
    }

    playWithPet() {
        if (!this.isLoggedIn) return;

        const success = this.pet.play();
        if (success) {
            this.petMessage("Wheee! That was so much fun!");
            
            // Check for playful achievement
            if (this.pet.playCount >= 5 && !this.achievements.playful) {
                this.unlockAchievement('playful');
            }
        } else {
            if (this.pet.isSleeping) {
                this.petMessage("Shhh... I'm sleeping!");
            } else {
                this.petMessage("I'm too tired to play right now...");
            }
        }
        
        this.updateUI();
    }

    putPetToSleep() {
        if (!this.isLoggedIn) return;

        const success = this.pet.sleep();
        if (success) {
            this.petMessage("Zzzzz... Good night!");
            
            // Check for good night achievement
            if (this.pet.sleepCount >= 3 && !this.achievements.goodNight) {
                this.unlockAchievement('goodNight');
            }
        } else {
            this.petMessage("I'm not sleepy right now!");
        }
        
        this.updateUI();
    }

    cleanPet() {
        if (!this.isLoggedIn) return;

        this.pet.clean();
        this.petMessage("Ahhh, I feel so fresh and clean now!");
        this.updateUI();
    }

    updateUI() {
        const status = this.pet.getStatus();
        
        // Update progress bars
        document.getElementById('hunger-bar').style.width = `${status.hunger}%`;
        document.getElementById('happiness-bar').style.width = `${status.happiness}%`;
        document.getElementById('energy-bar').style.width = `${status.energy}%`;
        
        // Update values
        document.getElementById('hunger-value').textContent = `${status.hunger}%`;
        document.getElementById('happiness-value').textContent = `${status.happiness}%`;
        document.getElementById('energy-value').textContent = `${status.energy}%`;
        
        // Update stats
        document.getElementById('play-time').textContent = `${status.playTime}m`;
        document.getElementById('interaction-count').textContent = status.totalInteractions;
        document.getElementById('pet-level').textContent = status.level;
        
        this.updatePetAppearance();
        this.saveToStorage();
    }

    updatePetAppearance() {
        const status = this.pet.getStatus();
        const petElement = document.getElementById('pet');
        const mouthElement = document.querySelector('.pet-mouth');
        const eyeElements = document.querySelectorAll('.pet-eye');
        const accessoryElement = document.getElementById('pet-accessory');
        
        // Update pet color based on happiness
        const petColors = {
            cat: { happy: '#ffb74d', normal: '#ffcc80', sad: '#ff9800' },
            dog: { happy: '#8d6e63', normal: '#a1887f', sad: '#6d4c41' },
            rabbit: { happy: '#bdbdbd', normal: '#e0e0e0', sad: '#9e9e9e' },
            fox: { happy: '#ff7043', normal: '#ff8a65', sad: '#f4511e' }
        };
        
        const colors = petColors[this.pet.type];
        if (status.happiness >= 70) {
            petElement.style.backgroundColor = colors.happy;
            petElement.style.animation = 'pulse 2s infinite';
        } else if (status.happiness >= 40) {
            petElement.style.backgroundColor = colors.normal;
            petElement.style.animation = 'none';
        } else {
            petElement.style.backgroundColor = colors.sad;
            petElement.style.animation = 'none';
        }
        
        // Update eyes based on energy
        if (status.energy >= 70) {
            eyeElements.forEach(eye => {
                eye.classList.remove('sleepy');
                eye.classList.add('happy');
            });
        } else if (status.energy >= 30) {
            eyeElements.forEach(eye => {
                eye.classList.remove('happy');
                eye.classList.remove('sleepy');
            });
        } else {
            eyeElements.forEach(eye => {
                eye.classList.remove('happy');
                eye.classList.add('sleepy');
            });
        }
        
        // Update mouth based on hunger and happiness
        if (status.hunger <= 30) {
            mouthElement.classList.remove('happy');
            mouthElement.classList.add('sad');
        } else if (status.happiness >= 70) {
            mouthElement.classList.remove('sad');
            mouthElement.classList.add('happy');
        } else {
            mouthElement.classList.remove('happy');
            mouthElement.classList.remove('sad');
        }
        
        // Update accessory based on happiness
        const accessories = {
            cat: '🐟',
            dog: '🦴',
            rabbit: '🥕',
            fox: '🍇'
        };
        
        if (status.happiness >= 80) {
            accessoryElement.textContent = accessories[this.pet.type];
            accessoryElement.style.animation = 'bounce 1s infinite alternate';
        } else {
            accessoryElement.textContent = '';
            accessoryElement.style.animation = 'none';
        }
        
        // Sleeping state
        if (status.isSleeping) {
            mouthElement.style.display = 'none';
            petElement.style.animation = 'none';
        } else {
            mouthElement.style.display = 'block';
        }
    }

    petMessage(message) {
        document.getElementById('pet-message').textContent = message;
    }

    unlockAchievement(achievement) {
        this.achievements[achievement] = true;
        
        const achievementMap = {
            firstMeal: 'achievement-1',
            playful: 'achievement-2',
            goodNight: 'achievement-3',
            nightOwl: 'achievement-4'
        };
        
        const element = document.getElementById(achievementMap[achievement]);
        if (element) {
            element.classList.add('unlocked');
        }
        
        this.petMessage(`Achievement unlocked! ${this.getAchievementName(achievement)}`);
        this.saveToStorage();
    }

    getAchievementName(achievement) {
        const names = {
            firstMeal: 'First Meal',
            playful: 'Playful',
            goodNight: 'Good Night',
            nightOwl: 'Night Owl'
        };
        return names[achievement] || 'Unknown Achievement';
    }

    startGameLoop() {
        setInterval(() => {
            if (this.isLoggedIn) {
                this.pet.updateStats();
                this.updateUI();
                
                // Random day/night cycle (for demo purposes)
                if (Math.random() < 0.01) {
                    this.toggleDayNight();
                }
            }
        }, 1000);
    }

    toggleDayNight() {
        this.isDay = !this.isDay;
        document.body.classList.toggle('night-mode', !this.isDay);
        
        if (!this.isDay && this.isLoggedIn) {
            this.pet.recordNightInteraction();
            if (this.pet.nightInteractions >= 1 && !this.achievements.nightOwl) {
                this.unlockAchievement('nightOwl');
            }
        }
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveToStorage();
        }, 30000); // Save every 30 seconds
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    saveToStorage() {
        if (!this.isLoggedIn) return;

        const saveData = {
            pet: this.pet,
            achievements: this.achievements,
            isDay: this.isDay,
            currentUser: this.currentUser,
            timestamp: Date.now()
        };

        localStorage.setItem(`virtualPet_${this.currentUser}`, JSON.stringify(saveData));
    }

    loadFromStorage() {
        // Try to load the last user's data
        const lastUser = localStorage.getItem('lastUser');
        if (lastUser) {
            const saveData = localStorage.getItem(`virtualPet_${lastUser}`);
            if (saveData) {
                try {
                    const data = JSON.parse(saveData);
                    document.getElementById('username').value = data.currentUser;
                } catch (e) {
                    console.error('Error loading save data:', e);
                }
            }
        }
    }
}