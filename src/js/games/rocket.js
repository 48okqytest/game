// Rocket Game Module
import { updateBalance, getRandomNumber, formatCurrency } from '../main.js';

let balance = 10000;
let gameActive = false;
let currentMultiplier = 1.0;
let cashoutMultiplier = 0;
let gameInterval;

export function initRocket() {
    const launchBtn = document.getElementById('launch-btn');
    const cashoutBtn = document.getElementById('cashout-btn');
    
    launchBtn.addEventListener('click', launchRocket);
    cashoutBtn.addEventListener('click', cashout);
}

function launchRocket() {
    if (gameActive) return;
    
    const betInput = document.getElementById('rocket-bet');
    const betAmount = parseInt(betInput.value) || 0;
    const launchBtn = document.getElementById('launch-btn');
    
    // Validate bet
    if (betAmount < 100 || betAmount > 100000) {
        alert('Bet amount must be between 100 and 100,000');
        return;
    }
    
    if (balance < betAmount) {
        alert('Not enough balance!');
        return;
    }
    
    // Deduct bet from balance
    balance -= betAmount;
    updateBalance(balance);
    
    // Reset game state
    gameActive = true;
    currentMultiplier = 1.0;
    cashoutMultiplier = 0;
    
    // Update UI
    launchBtn.disabled = true;
    document.getElementById('cashout-btn').classList.remove('hidden');
    document.getElementById('explosion-point').classList.add('hidden');
    
    // Position rocket at bottom
    const rocket = document.getElementById('rocket');
    rocket.style.bottom = '0px';
    
    // Start game
    let position = 0;
    const maxPosition = 100; // 100% of track height
    const explosionPoint = getRandomNumber(30, 95); // When rocket explodes (30-95%)
    
    // Determine crash multiplier (1.1x - 10x)
    const crashMultiplier = 1 + (Math.random() * 9);
    
    gameInterval = setInterval(() => {
        position += 0.5;
        rocket.style.bottom = `${position}%`;
        currentMultiplier = 1 + (position / 100) * (crashMultiplier - 1);
        
        // Update multiplier display
        document.getElementById('multiplier-display').textContent = currentMultiplier.toFixed(2) + 'x';
        
        // Check for explosion
        if (position >= explosionPoint) {
            clearInterval(gameInterval);
            explodeRocket(betAmount);
        }
    }, 50);
}

function cashout() {
    if (!gameActive) return;
    
    clearInterval(gameInterval);
    gameActive = false;
    cashoutMultiplier = currentMultiplier;
    
    const betInput = document.getElementById('rocket-bet');
    const betAmount = parseInt(betInput.value) || 0;
    
    // Calculate win
    const winAmount = Math.floor(betAmount * cashoutMultiplier);
    balance += winAmount;
    updateBalance(balance);
    
    // Update UI
    document.getElementById('launch-btn').disabled = false;
    document.getElementById('cashout-btn').classList.add('hidden');
    
    // Add to history
    addToHistory(cashoutMultiplier, true);
    
    alert(`You cashed out at ${cashoutMultiplier.toFixed(2)}x and won ${formatCurrency(winAmount)}!`);
    playSound('win');
}

function explodeRocket(betAmount) {
    gameActive = false;
    
    // Show explosion
    const explosionPoint = document.getElementById('explosion-point');
    explosionPoint.style.bottom = `${rocket.style.bottom}`;
    explosionPoint.classList.remove('hidden');
    
    // Reset UI
    document.getElementById('launch-btn').disabled = false;
    document.getElementById('cashout-btn').classList.add('hidden');
    
    // Add to history
    addToHistory(currentMultiplier, false);
    
    alert(`Rocket exploded at ${currentMultiplier.toFixed(2)}x!`);
    playSound('explosion');
}

function addToHistory(multiplier, cashedOut) {
    const historyList = document.getElementById('rocket-history');
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    
    historyItem.innerHTML = `
        <span class="multiplier ${cashedOut ? 'cashed-out' : 'crashed'}">
            ${multiplier.toFixed(2)}x
        </span>
        <span class="result">${cashedOut ? 'Cashed Out' : 'Crashed'}</span>
    `;
    
    historyList.prepend(historyItem);
    
    // Limit history items
    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

function playSound(type) {
    // In a real implementation, you would play an audio file
    console.log(`Playing ${type} sound`);
}
