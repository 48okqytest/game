// Slots Game Module
import { updateBalance, getRandomNumber, formatCurrency } from '../main.js';

const slotSymbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '7', '💰', '🔔'];
let currentBet = 100;
let balance = 10000;
let isSpinning = false;

export function initSlots() {
    // Set up bet buttons
    const betButtons = document.querySelectorAll('.bet-btn');
    betButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentBet = parseInt(button.getAttribute('data-bet'));
            document.getElementById('current-bet').textContent = currentBet;
            
            // Update active button
            betButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Custom bet input
    const customBet = document.getElementById('custom-bet');
    customBet.addEventListener('change', () => {
        const betValue = parseInt(customBet.value) || 0;
        if (betValue >= 100 && betValue <= 100000) {
            currentBet = betValue;
            document.getElementById('current-bet').textContent = currentBet;
            
            // Update active button
            betButtons.forEach(btn => btn.classList.remove('active'));
        }
    });
    
    // Spin button
    const spinBtn = document.getElementById('spin-btn');
    spinBtn.addEventListener('click', spinSlots);
}

function spinSlots() {
    if (isSpinning) return;
    
    const reel1 = document.getElementById('reel1');
    const reel2 = document.getElementById('reel2');
    const reel3 = document.getElementById('reel3');
    const spinBtn = document.getElementById('spin-btn');
    
    // Check balance
    if (balance < currentBet) {
        alert('Not enough balance!');
        return;
    }
    
    // Deduct bet from balance
    balance -= currentBet;
    updateBalance(balance);
    
    isSpinning = true;
    spinBtn.disabled = true;
    
    // Reset reels
    reel1.textContent = '';
    reel2.textContent = '';
    reel3.textContent = '';
    
    // Animation duration
    const duration = 3000;
    const startTime = Date.now();
    
    // Spin animation
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Random symbols during spin
        reel1.textContent = slotSymbols[getRandomNumber(0, slotSymbols.length - 1)];
        reel2.textContent = slotSymbols[getRandomNumber(0, slotSymbols.length - 1)];
        reel3.textContent = slotSymbols[getRandomNumber(0, slotSymbols.length - 1)];
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Final result
            const symbols = [
                slotSymbols[getRandomNumber(0, slotSymbols.length - 1)],
                slotSymbols[getRandomNumber(0, slotSymbols.length - 1)],
                slotSymbols[getRandomNumber(0, slotSymbols.length - 1)]
            ];
            
            reel1.textContent = symbols[0];
            reel2.textContent = symbols[1];
            reel3.textContent = symbols[2];
            
            // Check for win
            checkWin(symbols);
            isSpinning = false;
            spinBtn.disabled = false;
        }
    }
    
    animate();
}

function checkWin(symbols) {
    let winAmount = 0;
    let multiplier = 0;
    
    // Check for three matching symbols
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        switch (symbols[0]) {
            case '🍒':
                multiplier = 2;
                break;
            case '🍋':
                multiplier = 3;
                break;
            case '🍊':
                multiplier = 4;
                break;
            case '🍇':
                multiplier = 5;
                break;
            case '🍉':
                multiplier = 7;
                break;
            case '7':
                multiplier = 10;
                break;
            case '💰':
                multiplier = 15;
                break;
            case '🔔':
                multiplier = 20;
                break;
        }
    }
    // Check for two matching symbols (cherries only)
    else if (symbols[0] === '🍒' && symbols[1] === '🍒') {
        multiplier = 1;
    }
    
    // Calculate win
    if (multiplier > 0) {
        winAmount = currentBet * multiplier;
        balance += winAmount;
        updateBalance(balance);
        
        // Update UI
        document.getElementById('last-win').textContent = formatCurrency(winAmount);
        document.getElementById('current-multiplier').textContent = `${multiplier}x`;
        
        // Play win sound
        playSound('win');
    } else {
        document.getElementById('last-win').textContent = '0';
        document.getElementById('current-multiplier').textContent = '1x';
    }
}

function playSound(type) {
    // In a real implementation, you would play an audio file
    console.log(`Playing ${type} sound`);
}
