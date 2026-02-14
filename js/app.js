/**
 * Rock Paper Scissors Game
 * Main Application Logic
 */

// ===================================
// Game State
// ===================================

const CHOICES = ['rock', 'paper', 'scissors'];
const STORAGE_KEY = 'rps_game_scores';

const state = {
  playerScore: 0,
  computerScore: 0,
  playerChoice: null,
  computerChoice: null,
  result: null
};

// ===================================
// DOM Elements
// ===================================

const elements = {
  // Screens
  gameScreen: document.getElementById('game-screen'),
  resultScreen: document.getElementById('result-screen'),
  celebrationOverlay: document.getElementById('celebration-overlay'),

  // Score displays
  playerScoreEl: document.getElementById('player-score'),
  computerScoreEl: document.getElementById('computer-score'),
  playerScoreBox: document.getElementById('player-score-box'),
  computerScoreBox: document.getElementById('computer-score-box'),

  // Game options
  optionBtns: document.querySelectorAll('.option'),

  // Result screen elements
  playerPick: document.getElementById('player-pick'),
  computerPick: document.getElementById('computer-pick'),
  playerPickCircle: document.getElementById('player-pick-circle'),
  computerPickCircle: document.getElementById('computer-pick-circle'),
  playerPickIcon: document.getElementById('player-pick-icon'),
  computerPickIcon: document.getElementById('computer-pick-icon'),
  resultMessage: document.getElementById('result-message'),
  resultTitle: document.getElementById('result-title'),
  resultSubtitle: document.getElementById('result-subtitle'),
  playAgainBtn: document.getElementById('play-again-btn'),
  nextBtn: document.getElementById('next-btn'),

  // Celebration elements
  confettiContainer: document.getElementById('confetti-container'),
  celebrationPlayAgainBtn: document.getElementById('celebration-play-again-btn'),
  celebrationRulesBtn: document.getElementById('celebration-rules-btn'),

  // Modal elements
  rulesModal: document.getElementById('rules-modal'),
  rulesBtn: document.getElementById('rules-btn'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalRulesBtn: document.getElementById('modal-rules-btn')
};

// ===================================
// Icon Mappings
// ===================================

const ICONS = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️'
};

const CHOICE_CLASSES = {
  rock: 'pick__circle--rock',
  paper: 'pick__circle--paper',
  scissors: 'pick__circle--scissors'
};

// ===================================
// Local Storage Functions
// ===================================

/**
 * Load scores from localStorage
 */
function loadScores() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const scores = JSON.parse(saved);
      state.playerScore = scores.playerScore || 0;
      state.computerScore = scores.computerScore || 0;
    }
  } catch (error) {
    console.error('Error loading scores:', error);
    state.playerScore = 0;
    state.computerScore = 0;
  }
  updateScoreDisplay();
}

/**
 * Save scores to localStorage
 */
function saveScores() {
  try {
    const scores = {
      playerScore: state.playerScore,
      computerScore: state.computerScore
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (error) {
    console.error('Error saving scores:', error);
  }
}

// ===================================
// Game Logic Functions
// ===================================

/**
 * Generate random computer choice
 * @returns {string} - 'rock', 'paper', or 'scissors'
 */
function getComputerChoice() {
  const randomIndex = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[randomIndex];
}

/**
 * Determine the winner of the round
 * @param {string} playerChoice 
 * @param {string} computerChoice 
 * @returns {string} - 'win', 'lose', or 'tie'
 */
function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'tie';
  }

  const winConditions = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };

  if (winConditions[playerChoice] === computerChoice) {
    return 'win';
  }

  return 'lose';
}

/**
 * Update scores based on result
 * @param {string} result - 'win', 'lose', or 'tie'
 */
function updateScores(result) {
  if (result === 'win') {
    state.playerScore++;
    animateScoreBox(elements.playerScoreBox);
  } else if (result === 'lose') {
    state.computerScore++;
    animateScoreBox(elements.computerScoreBox);
  }

  updateScoreDisplay();
  saveScores();
}

/**
 * Update score display in DOM
 */
function updateScoreDisplay() {
  elements.playerScoreEl.textContent = state.playerScore;
  elements.computerScoreEl.textContent = state.computerScore;
}

/**
 * Animate score box on update
 * @param {HTMLElement} scoreBox 
 */
function animateScoreBox(scoreBox) {
  scoreBox.classList.add('score-box--highlight');
  setTimeout(() => {
    scoreBox.classList.remove('score-box--highlight');
  }, 400);
}

// ===================================
// UI Functions
// ===================================

/**
 * Show a specific screen
 * @param {string} screenId - 'game', 'result', or 'celebration'
 */
function showScreen(screenId) {
  // Hide all screens
  elements.gameScreen.classList.remove('active');
  elements.resultScreen.classList.remove('active');
  elements.celebrationOverlay.classList.remove('active');

  // Show requested screen
  switch (screenId) {
    case 'game':
      elements.gameScreen.classList.add('active');
      elements.rulesBtn.style.display = 'block';
      elements.nextBtn.classList.remove('visible'); // Hide Next button on game screen
      document.body.style.background = '#8CC461'; // Figma game screen bg
      break;
    case 'result':
      elements.resultScreen.classList.add('active');
      elements.rulesBtn.style.display = 'block';
      document.body.style.background = '#89C15E'; // Figma result screen bg
      break;
    case 'celebration':
      elements.celebrationOverlay.classList.add('active');
      elements.rulesBtn.style.display = 'none';
      elements.nextBtn.classList.remove('visible'); // Hide Next button on celebration
      document.body.style.background = '#8CC461'; // Figma game screen bg
      createConfetti();
      break;
  }
}

/**
 * Update pick display with choice
 * @param {HTMLElement} circleEl 
 * @param {HTMLElement} iconEl 
 * @param {string} choice 
 */
function updatePickDisplay(circleEl, iconEl, choice) {
  // Remove all choice classes
  Object.values(CHOICE_CLASSES).forEach(cls => {
    circleEl.classList.remove(cls);
  });

  // Add appropriate class and icon
  circleEl.classList.add(CHOICE_CLASSES[choice]);
  iconEl.textContent = ICONS[choice];
}

/**
 * Show result screen with picks and outcome
 * @param {string} result - 'win', 'lose', or 'tie'
 * @param {string} playerChoice 
 * @param {string} computerChoice 
 */
function showResultScreen(result, playerChoice, computerChoice) {
  // Update picks display
  updatePickDisplay(elements.playerPickCircle, elements.playerPickIcon, playerChoice);
  updatePickDisplay(elements.computerPickCircle, elements.computerPickIcon, computerChoice);

  // Remove previous winner indicators
  elements.playerPick.classList.remove('pick--winner');
  elements.computerPick.classList.remove('pick--winner');

  // Update result message and winner indicators
  // Show Next button (at bottom beside Rules) only on win
  if (result === 'win') {
    elements.nextBtn.classList.add('visible');
    elements.playAgainBtn.textContent = 'Play Again';
  } else {
    elements.nextBtn.classList.remove('visible');
    // Show "Replay" for ties, "Play Again" for losses
    elements.playAgainBtn.textContent = result === 'tie' ? 'Replay' : 'Play Again';
  }

  switch (result) {
    case 'win':
      elements.resultTitle.textContent = 'YOU WIN';
      elements.resultSubtitle.textContent = 'AGAINST PC';
      elements.playerPick.classList.add('pick--winner');
      break;
    case 'lose':
      elements.resultTitle.textContent = 'YOU LOST';
      elements.resultSubtitle.textContent = 'AGAINST PC';
      elements.computerPick.classList.add('pick--winner');
      break;
    case 'tie':
      elements.resultTitle.textContent = 'TIE UP';
      elements.resultSubtitle.textContent = '';
      break;
  }

  // Add reveal animations
  elements.playerPick.classList.add('pick--reveal');
  elements.computerPick.classList.add('pick--reveal');
  elements.resultMessage.classList.add('result-message--animate');

  showScreen('result');

  // Remove animation classes after animation completes
  setTimeout(() => {
    elements.playerPick.classList.remove('pick--reveal');
    elements.computerPick.classList.remove('pick--reveal');
    elements.resultMessage.classList.remove('result-message--animate');
  }, 600);
}

/**
 * Show celebration screen with confetti
 */
function showCelebration() {
  showScreen('celebration');
}

// ===================================
// Confetti Animation
// ===================================

const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

/**
 * Create confetti particles for celebration
 */
function createConfetti() {
  // Clear existing confetti
  elements.confettiContainer.innerHTML = '';

  const confettiCount = 100;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';

    // Random properties
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = 2 + Math.random() * 3;
    const size = 5 + Math.random() * 10;
    const shape = Math.random() > 0.5 ? '50%' : '0';

    confetti.style.cssText = `
      left: ${left}%;
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: ${shape};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;

    elements.confettiContainer.appendChild(confetti);
  }
}

/**
 * Clear confetti from celebration
 */
function clearConfetti() {
  elements.confettiContainer.innerHTML = '';
}

// ===================================
// Modal Functions
// ===================================

/**
 * Open rules modal
 */
function openRulesModal() {
  elements.rulesModal.classList.add('active');
}

/**
 * Close rules modal
 */
function closeRulesModal() {
  elements.rulesModal.classList.remove('active');
}

// ===================================
// Game Flow Functions
// ===================================

/**
 * Handle player choice and play round
 * @param {string} choice 
 */
function playRound(choice) {
  // Set player choice
  state.playerChoice = choice;

  // Get computer choice (simultaneous)
  state.computerChoice = getComputerChoice();

  // Determine winner
  state.result = determineWinner(state.playerChoice, state.computerChoice);

  // Update scores
  updateScores(state.result);

  // Show result screen for all outcomes
  // For wins, the Next button will be shown which leads to celebration
  showResultScreen(state.result, state.playerChoice, state.computerChoice);
}

/**
 * Go to celebration screen (called from Next button on win)
 */
function goToCelebration() {
  showCelebration();
}

/**
 * Reset to game screen for new round
 */
function playAgain() {
  state.playerChoice = null;
  state.computerChoice = null;
  state.result = null;
  clearConfetti();
  showScreen('game');
}

// ===================================
// Event Listeners
// ===================================

function initEventListeners() {
  // Game option buttons
  elements.optionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const choice = btn.dataset.choice;

      // Add selection animation
      btn.classList.add('option--selected');
      setTimeout(() => {
        btn.classList.remove('option--selected');
      }, 300);

      // Small delay for visual feedback
      setTimeout(() => {
        playRound(choice);
      }, 150);
    });
  });

  // Play Again buttons
  elements.playAgainBtn.addEventListener('click', playAgain);
  elements.celebrationPlayAgainBtn.addEventListener('click', playAgain);

  // Next button (for win - goes to celebration)
  elements.nextBtn.addEventListener('click', goToCelebration);

  // Rules buttons
  elements.rulesBtn.addEventListener('click', openRulesModal);
  elements.celebrationRulesBtn.addEventListener('click', openRulesModal);

  // Modal close
  elements.modalCloseBtn.addEventListener('click', closeRulesModal);

  // Modal rules button also closes modal
  if (elements.modalRulesBtn) {
    elements.modalRulesBtn.addEventListener('click', closeRulesModal);
  }

  // Close modal on overlay click
  elements.rulesModal.addEventListener('click', (e) => {
    if (e.target === elements.rulesModal) {
      closeRulesModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.rulesModal.classList.contains('active')) {
      closeRulesModal();
    }
  });
}

// ===================================
// Initialization
// ===================================

function init() {
  loadScores();
  initEventListeners();
  showScreen('game');
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', init);
