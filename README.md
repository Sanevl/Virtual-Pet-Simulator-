## Virtual Pet Simulator

## Quick Start (2 Methods)

## Method 1: Live Server (No Installation Required)

1. Download and extract the project files
2. Open VS code
3. File -> Open Folder - Select the frontend folder
4. Install Live Server extension (if not installed):

      * Go to Extensions (Ctrl+Shift+X)
      * Search "Live Server" by Ritwick Dey
      * Click Install

5. Right-click on index.html -> "Open with Live Server"
6. Game opens automatically in your browser at http://127.0.0.1:5500

## Method 2: Direct File Open

1. Navigate to the frontend folder
2. Double-click index.html
3. Game opens in your default browser

## long Start (need node.js installed)
## Method 3: Node.js Backend (Full Stack)

Ensure Node.js is installed on your system
Open terminal in project root and run:

##
cd backend
npm install
npm start
Open browser to http://localhost:3000
##


###

📁 Project Structure: 

virtual-pet-simulator/
├── frontend/                    # Frontend files (for Live Server)
│   ├── index.html              # Main game file
│   ├── styles/
│   │   └── main.css            # All styling and animations
│   └── scripts/
│       ├── pet.js              # Pet behavior and logic
│       ├── game.js             # Game management
│       └── app.js              # App initialization
└── backend/                    # Backend files (for Node.js)
    ├── server.js               # Express server
    ├── models/
    │   └── Pet.js              # Pet data model
    ├── routes/
    │   ├── auth.js             # Authentication routes
    │   ├── pets.js             # Pet interaction routes
    │   └── leaderboard.js      # Leaderboard routes
    ├── config/
    │   └── database.js         # In-memory database
    └── package.json            # Dependencies

###