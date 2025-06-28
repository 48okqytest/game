// Cases Game Module
import { updateBalance, getRandomNumber, formatCurrency } from '../main.js';

const caseValues = [50, 100, 200, 500, 1000, 2000, 5000, 10000, 25000, 50000, 100000];
let remainingValues = [];
let selectedCase = null;
let openedCases = [];
let balance = 10000;
let gameActive = false;

export function initCases() {
    // Initialize cases grid
    const casesGrid = document.getElementById('cases-grid');
    casesGrid.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
        const caseElement = document.createElement('div');
        caseElement.classList.add('case');
        caseElement.setAttribute('data-value', '0');
        caseElement.innerHTML = `<span class="case-number">${i + 1}</span>`;
        caseElement.addEventListener('click', () => selectCase(i + 1, caseElement));
        casesGrid.appendChild(caseElement);
    }
    
    // Start new game
    document.getElementById('new-game-btn').addEventListener('click', startNewGame);
    
    // Open case button
    document.getElementById('open-case-btn').addEventListener('click', openSelectedCase);
    
    // Offer buttons
    document.getElementById('accept-offer').addEventListener('click', acceptOffer);
    document.getElementById('decline-offer').addEventListener('click', declineOffer);
    
    // Start initial game
    startNewGame();
}

function startNewGame() {
    // Reset game state
    remainingValues = [...caseValues];
    openedCases = [];
    gameActive = true;
    
    // Shuffle values
    for (let i = remainingValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingValues[i], remainingValues[j]] = [remainingValues[j], remainingValues[i]];
    }
    
    // Assign values to cases (first 11 cases get values, last case is empty)
    const cases = document.querySelectorAll('#cases-grid .case');
    cases.forEach((caseElement, index) => {
        caseElement.classList.remove('opened', 'selected');
        caseElement.setAttribute('data-value', index < remainingValues.length ? remainingValues[index] : 0);
        caseElement.innerHTML = `<span class="case-number">${index + 1}</span>`;
    });
    
    // Reset UI
    document.getElementById('selected-case').classList.add('hidden');
    document.getElementById('offer-section').classList.add('hidden');
    document.getElementById('open-case-btn').classList.add('hidden');
    document.getElementById('new-game-btn').classList.add('hidden');
    
    selectedCase = null;
}

function selectCase(caseNumber, caseElement) {
    if (!gameActive || caseElement.classList.contains('opened')) return;
    
    // If no case selected yet, this is the player's case
    if (selectedCase === null) {
        selectedCase = {
            number: caseNumber,
            element: caseElement,
            value: parseInt(caseElement.getAttribute('data-value'))
        };
        
        caseElement.classList.add('selected');
        
        // Update UI
        const selectedCaseDisplay = document.getElementById('selected-case');
        selectedCaseDisplay.classList.remove('hidden');
        selectedCaseDisplay.querySelector('.case-number').textContent = caseNumber;
        
        document.getElementById('open-case-btn').classList.remove('hidden');
    } 
    // Otherwise, open the selected case
    else {
        openCase(caseNumber, caseElement);
    }
}

function openSelectedCase() {
    if (!selectedCase || !gameActive) return;
    
    // Open the selected case
    openCase(selectedCase.number, selectedCase.element);
    
    // After opening player's case, enable case opening
    document.getElementById('open-case-btn').classList.add('hidden');
}

function openCase(caseNumber, caseElement) {
    const value = parseInt(caseElement.getAttribute('data-value'));
    caseElement.classList.add('opened');
    caseElement.innerHTML = value > 0 ? formatCurrency(value) : 'EMPTY';
    
    // Add to opened cases
    openedCases.push(value);
    
    // Remove from remaining values if not empty
    if (value > 0) {
        remainingValues = remainingValues.filter(v => v !== value);
    }
    
    // Check if game should end
    checkGameStatus();
}

function checkGameStatus() {
    // Calculate bank offer (average of remaining values)
    const offer = Math.floor(remainingValues.reduce((sum, val) => sum + val, 0) / remainingValues.length);
    
    // Update offer
    document.getElementById('offer-amount').textContent = formatCurrency(offer);
    
    // Show offer after a few cases opened
    if (openedCases.length >= 3 && openedCases.length < caseValues.length) {
        document.getElementById('offer-section').classList.remove('hidden');
    }
    
    // Check if game ended
    if (openedCases.length === caseValues.length) {
        endGame();
    }
}

function acceptOffer() {
    if (!gameActive) return;
    
    const offerAmount = parseInt(document.getElementById('offer-amount').textContent.replace(/,/g, ''));
    balance += offerAmount;
    updateBalance(balance);
    
    alert(`You accepted the offer of ${formatCurrency(offerAmount)}!`);
    endGame();
}

function declineOffer() {
    document.getElementById('offer-section').classList.add('hidden');
}

function endGame() {
    gameActive = false;
    
    // Reveal selected case value
    if (selectedCase) {
        const selectedCaseDisplay = document.getElementById('selected-case').querySelector('.case');
        selectedCaseDisplay.setAttribute('data-value', selectedCase.value);
        selectedCaseDisplay.innerHTML = selectedCase.value > 0 ? formatCurrency(selectedCase.value) : 'EMPTY';
    }
    
    // Show new game button
    document.getElementById('new-game-btn').classList.remove('hidden');
    document.getElementById('offer-section').classList.add('hidden');
    
    // Play sound
    playSound(selectedCase.value > 0 ? 'win' : 'lose');
}

function playSound(type) {
    // In a real implementation, you would play an audio file
    console.log(`Playing ${type} sound`);
}
