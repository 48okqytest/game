// Case Battles Module
import { updateBalance, getRandomNumber, formatCurrency } from '../main.js';

let balance = 10000;
let currentBattle = null;
let battleRound = 1;
let totalRounds = 5;
let playerCases = [];
let botCases = [];
let battleValues = [];

export function initCaseBattles() {
    // Create battle button
    document.getElementById('create-battle-btn').addEventListener('click', () => {
        document.getElementById('create-battle-modal').classList.add('active');
    });
    
    // Battle form submission
    document.getElementById('battle-form').addEventListener('submit', (e) => {
        e.preventDefault();
        createBattle();
    });
    
    // Battle controls
    document.getElementById('battle-start-btn').addEventListener('click', startBattleRound);
    document.getElementById('battle-next-btn').addEventListener('click', startNextRound);
    
    // Populate battle list with fake battles
    populateBattleList();
}

function createBattle() {
    const betAmount = parseInt(document.getElementById('battle-bet').value) || 0;
    totalRounds = parseInt(document.getElementById('battle-rounds').value);
    
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
    
    // Create battle
    currentBattle = {
        bet: betAmount,
        totalRounds,
        currentRound: 1,
        playerScore: 0,
        botScore: 0
    };
    
    // Initialize battle values
    battleValues = generateBattleValues(totalRounds * 2); // 2 cases per round
    
    // Update UI
    document.getElementById('create-battle-modal').classList.remove('active');
    document.querySelector('.battles-lobby').classList.add('hidden');
    document.getElementById('battle-game').classList.remove('hidden');
    document.getElementById('battle-prize').textContent = formatCurrency(betAmount * 2);
    document.getElementById('battle-round').textContent = '1/' + totalRounds;
    
    // Reset battle state
    battleRound = 1;
    playerCases = [];
    botCases = [];
    
    // Prepare for first round
    prepareBattleRound();
}

function populateBattleList() {
    const battleList = document.getElementById('battle-list');
    battleList.innerHTML = '';
    
    // Add some fake battles
    const fakeBattles = [
        { host: 'Player1', bet: 500, rounds: 5, players: 1 },
        { host: 'Player2', bet: 1000, rounds: 3, players: 2 },
        { host: 'Player3', bet: 2000, rounds: 7, players: 1 }
    ];
    
    fakeBattles.forEach(battle => {
        const battleItem = document.createElement('div');
        battleItem.classList.add('battle-item');
        
        battleItem.innerHTML = `
            <div class="battle-info">
                <span class="battle-host">${battle.host}</span>
                <span class="battle-details">${formatCurrency(battle.bet)} | ${battle.rounds} Rounds | ${battle.players}/2 Players</span>
            </div>
            <button class="battle-join">Join</button>
        `;
        
        battleList.appendChild(battleItem);
    });
}

function prepareBattleRound() {
    // Reset UI
    document.getElementById('battle-start-btn').classList.remove('hidden');
    document.getElementById('battle-next-btn').classList.add('hidden');
    
    // Clear previous cases
    const playerCaseContainer = document.querySelector('#player1 .player-cases');
    const botCaseContainer = document.querySelector('#player2 .player-cases');
    playerCaseContainer.innerHTML = '';
    botCaseContainer.innerHTML = '';
}

function startBattleRound() {
    if (!currentBattle) return;
    
    // Get cases for this round (2 from battleValues)
    const roundCases = battleValues.splice(0, 2);
    
    // Player gets first case, bot gets second
    const playerCaseValue = roundCases[0];
    const botCaseValue = roundCases[1];
    
    // Add to player cases
    playerCases.push(playerCaseValue);
    botCases.push(botCaseValue);
    
    // Display cases
    displayBattleCases(playerCaseValue, botCaseValue);
    
    // Determine round winner
    setTimeout(() => {
        determineRoundWinner(playerCaseValue, botCaseValue);
    }, 1000);
}

function displayBattleCases(playerValue, botValue) {
    const playerCaseContainer = document.querySelector('#player1 .player-cases');
    const botCaseContainer = document.querySelector('#player2 .player-cases');
    
    // Create case elements
    const playerCase = document.createElement('div');
    playerCase.classList.add('case');
    playerCase.textContent = formatCurrency(playerValue);
    
    const botCase = document.createElement('div');
    botCase.classList.add('case');
    botCase.textContent = formatCurrency(botValue);
    
    // Add to containers
    playerCaseContainer.appendChild(playerCase);
    botCaseContainer.appendChild(botCase);
    
    // Disable start button
    document.getElementById('battle-start-btn').classList.add('hidden');
}

function determineRoundWinner(playerValue, botValue) {
    if (!currentBattle) return;
    
    // Highlight winning case
    if (playerValue > botValue) {
        document.querySelector('#player1 .player-cases .case:last-child').classList.add('winner');
        currentBattle.playerScore++;
    } else if (botValue > playerValue) {
        document.querySelector('#player2 .player-cases .case:last-child').classList.add('winner');
        currentBattle.botScore++;
    } // Tie - no score change
    
    // Update battle state
    currentBattle.currentRound++;
    
    // Check if battle is over
    if (currentBattle.currentRound > currentBattle.totalRounds) {
        endBattle();
    } else {
        // Enable next round button
        document.getElementById('battle-next-btn').classList.remove('hidden');
        document.getElementById('battle-round').textContent = `${currentBattle.currentRound}/${currentBattle.totalRounds}`;
    }
}

function startNextRound() {
    if (!currentBattle) return;
    
    prepareBattleRound();
}

function endBattle() {
    if (!currentBattle) return;
    
    // Determine battle winner
    let winner = null;
    if (currentBattle.playerScore > currentBattle.botScore) {
        winner = 'player';
    } else if (currentBattle.botScore > currentBattle.playerScore) {
        winner = 'bot';
    } // Tie
    
    // Calculate prize
    let prize = 0;
    if (winner === 'player') {
        prize = currentBattle.bet * 2;
        balance += prize;
        updateBalance(balance);
        alert(`You won the battle and ${formatCurrency(prize)}!`);
        playSound('win');
    } else if (winner === 'bot') {
        alert('The bot won the battle!');
        playSound('lose');
    } else {
        prize = currentBattle.bet;
        balance += prize;
        updateBalance(balance);
        alert(`The battle was a tie! You got your ${formatCurrency(prize)} back.`);
    }
    
    // Reset UI
    document.getElementById('battle-next-btn').classList.add('hidden');
    document.querySelector('.battles-lobby').classList.remove('hidden');
    document.getElementById('battle-game').classList.add('hidden');
    
    currentBattle = null;
}

function generateBattleValues(count) {
    const values = [];
    const minValue = 100;
    const maxValue = 100000;
    
    for (let i = 0; i < count; i++) {
        // Generate random value between min and max, rounded to nearest 100
        const value = Math.round(getRandomNumber(minValue, maxValue) / 100) * 100;
        values.push(value);
    }
    
    return values;
}

function playSound(type) {
    // In a real implementation, you would play an audio file
    console.log(`Playing ${type} sound`);
}
