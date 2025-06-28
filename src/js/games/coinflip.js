// Coin Flip Game Module
import { updateBalance, getRandomNumber, formatCurrency } from '../main.js';

let selectedSide = null;
let balance = 10000;

export function initCoinFlip() {
    // Side selection
    const sideButtons = document.querySelectorAll('.btn-side');
    sideButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            selectedSide = button.getAttribute('data-side');
            
            // Update active button
            sideButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    
    // Flip button
    const flipBtn = document.getElementById('flip-btn');
    flipBtn.addEventListener('click', flipCoin);
}

function flipCoin() {
    if (!selectedSide) {
        alert('Please select Heads or Tails!');
        return;
    }
    
    const coin = document.getElementById('coin');
    const betInput = document.getElementById('coinflip-bet');
    const betAmount = parseInt(betInput.value) || 0;
    const flipBtn = document.getElementById('flip-btn');
    
    // Validate bet
    if (betAmount < 100 || betAmount > 100000) {
        alert('Bet amount must be between 100 and 100,000');
        return;
    }
    
    if (balance < betAmount) {
        alert('Not enough balance!');
        return;
    }
    
    // Disable button during animation
    flipBtn.disabled = true;
    
    // Deduct bet from balance
    balance -= betAmount;
    updateBalance(balance);
    
    // Determine result
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const isWin = result === selectedSide;
    
    // Spin animation
    let flipCount = 0;
    const maxFlips = 5 + getRandomNumber(2, 4);
    const flipInterval = setInterval(() => {
        flipCount++;
        
        if (flipCount % 2 === 0) {
            coin.style.transform = 'rotateY(0deg)';
        } else {
            coin.style.transform = 'rotateY(180deg)';
        }
        
        if (flipCount >= maxFlips * 2) {
            clearInterval(flipInterval);
            
            // Final position based on result
            if (result === 'tails') {
                coin.style.transform = 'rotateY(180deg)';
            } else {
                coin.style.transform = 'rotateY(0deg)';
            }
            
            // Handle win/loss
            setTimeout(() => {
                if (isWin) {
                    const winAmount = betAmount * 1.95; // 5% house edge
                    balance += winAmount;
                    updateBalance(balance);
                    alert(`You won ${formatCurrency(winAmount)}!`);
                    playSound('win');
                } else {
                    alert('You lost!');
                    playSound('lose');
                }
                
                // Update history
                addToHistory(result);
                flipBtn.disabled = false;
            }, 500);
        }
    }, 200);
}

function addToHistory(result) {
    const historyList = document.getElementById('coinflip-history');
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item', result);
    historyItem.textContent = result === 'heads' ? 'H' : 'T';
    historyList.prepend(historyItem);
    
    // Limit history items
    if (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}

function playSound(type) {
    // In a real implementation, you would play an audio file
    console.log(`Playing ${type} sound`);
}
