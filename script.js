// Player class (JavaScript equivalent of Python Player class)
class Player {
    constructor(name, buyIn, endOfGameWealth) {
        this.name = name;
        this.buyIn = parseFloat(buyIn);
        this.endOfGameWealth = parseFloat(endOfGameWealth);
        this.amountOwed = 0;
    }

    toString() {
        return `${this.name} - ${this.buyIn} - ${this.endOfGameWealth}`;
    }
}

// PokerTable class (JavaScript equivalent of Python PokerTable class)
class PokerTable {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(player) {
        const index = this.players.findIndex(p => p.name === player.name);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }

    clearTable() {
        this.players = [];
    }

    settle() {
        // Calculate the total amount of money owed by each player
        const totalOwed = this.players.reduce((sum, player) => sum + player.endOfGameWealth, 0);
        const totalBuyIn = this.players.reduce((sum, player) => sum + player.buyIn, 0);

        if (Math.abs(totalOwed - totalBuyIn) > 0.01) { // Allow for small floating point differences
            throw new Error("The total amount of money owed by each player does not match the total amount of money bought in");
        }

        // Calculate the amount of money each player owes or is owed
        this.players.forEach(player => {
            player.amountOwed = player.endOfGameWealth - player.buyIn;
        });

        // Sort the players by the amount they owe or are owed
        this.players.sort((a, b) => a.amountOwed - b.amountOwed);

        return this.generateOptimalTransactions();
    }

    generateOptimalTransactions() {
        const transactions = [];
        const players = [...this.players]; // Create a copy to work with

        // Separate players who owe money (positive amountOwed) from those who are owed (negative amountOwed)
        const debtors = players.filter(p => p.amountOwed < 0.01).sort((a, b) => b.amountOwed - a.amountOwed);
        const creditors = players.filter(p => p.amountOwed > -0.01).sort((a, b) => a.amountOwed - b.amountOwed);

        let debtorIndex = 0;
        let creditorIndex = 0;

        while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
            const debtor = debtors[debtorIndex];
            const creditor = creditors[creditorIndex];

            const amount = Math.min(debtor.amountOwed, Math.abs(creditor.amountOwed));

            if (amount > 0.01) {
                transactions.push({
                    from: debtor.name,
                    to: creditor.name,
                    amount: amount
                });

                debtor.amountOwed -= amount;
                creditor.amountOwed += amount;
            }

            if (debtor.amountOwed < 0.01) {
                debtorIndex++;
            }
            if (Math.abs(creditor.amountOwed) < 0.01) {
                creditorIndex++;
            }
        }

        return transactions;
    }
}

// Global variables
let pokerTable = new PokerTable();
let selectedPlayer = null;

// DOM elements
const addPlayerForm = document.getElementById('addPlayerForm');
const playerNameInput = document.getElementById('playerName');
const buyInInput = document.getElementById('buyIn');
const endWealthInput = document.getElementById('endWealth');
const playersContainer = document.getElementById('playersContainer');
const clearTableBtn = document.getElementById('clearTableBtn');
const settleBtn = document.getElementById('settleBtn');
const settlementResults = document.getElementById('settlementResults');
const summaryContent = document.getElementById('summaryContent');
const transactionsContent = document.getElementById('transactionsContent');
const playerModal = document.getElementById('playerModal');
const closeModal = document.getElementById('closeModal');
const removePlayerBtn = document.getElementById('removePlayerBtn');

// Event listeners
addPlayerForm.addEventListener('submit', handleAddPlayer);
clearTableBtn.addEventListener('click', handleClearTable);
settleBtn.addEventListener('click', handleSettle);
closeModal.addEventListener('click', closePlayerModal);
removePlayerBtn.addEventListener('click', handleRemovePlayer);

// Close modal when clicking outside
playerModal.addEventListener('click', (e) => {
    if (e.target === playerModal) {
        closePlayerModal();
    }
});

// Handle form submission
function handleAddPlayer(e) {
    e.preventDefault();

    const name = playerNameInput.value.trim();
    const buyIn = parseFloat(buyInInput.value);
    const endWealth = parseFloat(endWealthInput.value);

    // Validation
    if (!name) {
        alert('Please enter a player name');
        return;
    }

    if (isNaN(buyIn) || buyIn < 0) {
        alert('Please enter a valid buy-in amount');
        return;
    }

    if (isNaN(endWealth) || endWealth < 0) {
        alert('Please enter a valid end of game amount');
        return;
    }

    // Check if player name already exists
    if (pokerTable.players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        alert('A player with this name already exists');
        return;
    }

    // Create and add player
    const player = new Player(name, buyIn, endWealth);
    pokerTable.addPlayer(player);

    // Clear form
    addPlayerForm.reset();

    // Update UI
    updateUI();
}

// Handle clear table
function handleClearTable() {
    if (confirm('Are you sure you want to clear all players from the table?')) {
        pokerTable.clearTable();
        updateUI();
    }
}

// Handle settle
function handleSettle() {
    try {
        const transactions = pokerTable.settle();
        displaySettlementResults(transactions);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Handle remove player
function handleRemovePlayer() {
    if (selectedPlayer) {
        pokerTable.removePlayer(selectedPlayer);
        closePlayerModal();
        updateUI();
    }
}

// Update UI
function updateUI() {
    updatePlayersDisplay();
    updateButtons();
    hideSettlementResults();
}

// Update players display
function updatePlayersDisplay() {
    if (pokerTable.players.length === 0) {
        playersContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <p>No players at the table yet</p>
                <p>Add players to get started</p>
            </div>
        `;
        return;
    }

    playersContainer.innerHTML = '';
    
    // Calculate positions around the table
    const positions = calculatePlayerPositions(pokerTable.players.length);
    
    pokerTable.players.forEach((player, index) => {
        const position = positions[index];
        const netAmount = player.endOfGameWealth - player.buyIn;
        const netClass = netAmount > 0.01 ? 'positive' : netAmount < -0.01 ? 'negative' : 'neutral';
        const cardClass = netAmount > 0.01 ? 'winner' : netAmount < -0.01 ? 'loser' : 'even';
        
        const playerCard = document.createElement('div');
        playerCard.className = `player-card ${cardClass}`;
        playerCard.style.left = `${position.x}%`;
        playerCard.style.top = `${position.y}%`;
        playerCard.innerHTML = `
            <div class="player-name">${player.name}</div>
            <div class="player-amount">Buy-in: $${player.buyIn.toFixed(2)}</div>
            <div class="player-amount">End: $${player.endOfGameWealth.toFixed(2)}</div>
            <div class="player-net ${netClass}">
                ${netAmount > 0.01 ? '+' : ''}$${netAmount.toFixed(2)}
            </div>
        `;
        
        playerCard.addEventListener('click', () => openPlayerModal(player));
        playersContainer.appendChild(playerCard);
    });
}

// Calculate positions around the poker table
function calculatePlayerPositions(playerCount) {
    const positions = [];
    const centerX = 50;
    const centerY = 50;
    const radius = 42; // Increased radius to position players at table edge
    
    for (let i = 0; i < playerCount; i++) {
        const angle = (i * 2 * Math.PI / playerCount) - Math.PI / 2; // Start from top
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        positions.push({ x, y });
    }
    
    return positions;
}

// Update buttons state
function updateButtons() {
    const hasPlayers = pokerTable.players.length > 0;
    clearTableBtn.disabled = !hasPlayers;
    settleBtn.disabled = !hasPlayers;
}

// Display settlement results
function displaySettlementResults(transactions) {
    const totalBuyIn = pokerTable.players.reduce((sum, p) => sum + p.buyIn, 0);
    const totalEndWealth = pokerTable.players.reduce((sum, p) => sum + p.endOfGameWealth, 0);
    
    // Update summary
    summaryContent.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Total Buy-ins:</span>
            <span class="summary-value">$${totalBuyIn.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Total End Amount:</span>
            <span class="summary-value">$${totalEndWealth.toFixed(2)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Difference:</span>
            <span class="summary-value ${Math.abs(totalBuyIn - totalEndWealth) < 0.01 ? 'neutral' : 'negative'}">
                $${(totalBuyIn - totalEndWealth).toFixed(2)}
            </span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Number of Players:</span>
            <span class="summary-value">${pokerTable.players.length}</span>
        </div>
    `;
    
    // Update transactions
    if (transactions.length === 0) {
        transactionsContent.innerHTML = `
            <div class="transaction-item">
                <span class="transaction-label">No transactions needed</span>
                <span class="transaction-value">Everyone is even!</span>
            </div>
        `;
    } else {
        transactionsContent.innerHTML = transactions.map((transaction, index) => `
            <div class="transaction-item">
                <span class="transaction-label">${index + 1}. ${transaction.from} → ${transaction.to}</span>
                <span class="transaction-value">$${transaction.amount.toFixed(2)}</span>
            </div>
        `).join('');
    }
    
    settlementResults.classList.remove('hidden');
    settlementResults.scrollIntoView({ behavior: 'smooth' });
}

// Hide settlement results
function hideSettlementResults() {
    settlementResults.classList.add('hidden');
}

// Open player modal
function openPlayerModal(player) {
    selectedPlayer = player;
    const netAmount = player.endOfGameWealth - player.buyIn;
    
    document.getElementById('modalPlayerName').textContent = player.name;
    document.getElementById('modalBuyIn').textContent = `$${player.buyIn.toFixed(2)}`;
    document.getElementById('modalEndWealth').textContent = `$${player.endOfGameWealth.toFixed(2)}`;
    document.getElementById('modalNetResult').textContent = `${netAmount > 0 ? '+' : ''}$${netAmount.toFixed(2)}`;
    document.getElementById('modalNetResult').className = netAmount > 0.01 ? 'positive' : netAmount < -0.01 ? 'negative' : 'neutral';
    
    playerModal.classList.remove('hidden');
}

// Close player modal
function closePlayerModal() {
    playerModal.classList.add('hidden');
    selectedPlayer = null;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Initialize UI
updateUI(); 