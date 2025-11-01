const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const leaderboardRoutes = require('./routes/leaderboard');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Virtual Pet Simulator API is running!',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Endpoint not found' 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Virtual Pet Simulator server running on port ${PORT}`);
    console.log(`📱 Frontend available at: http://localhost:${PORT}`);
    console.log(`🔗 API Health check: http://localhost:${PORT}/api/health`);
    console.log(`🐾 Start playing by visiting: http://localhost:${PORT}`);
});