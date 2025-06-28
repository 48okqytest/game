// Main application module
import { initAuth } from './auth.js';
import { initUI } from './ui.js';
import { initSlots } from './games/slots.js';
import { initCoinFlip } from './games/coinflip.js';
import { initRocket } from './games/rocket.js';
import { initCases } from './games/cases.js';
import { initCaseBattles } from './games/casebattles.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initAuth();
    initUI();
    initSlots();
    initCoinFlip();
    initRocket();
    initCases();
    initCaseBattles();
    
    // Set initial balance
    updateBalance(10000);
});

// Global functions
export function updateBalance(amount) {
    const balanceElement = document.getElementById('user-balance');
    balanceElement.textContent = amount.toLocaleString();
}

export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatCurrency(amount) {
    return amount.toLocaleString();
}
