// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameManager();
    game.init();
    window.game = game; // Make it accessible from console for debugging
});