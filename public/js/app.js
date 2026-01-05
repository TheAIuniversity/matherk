// MATHERK - Main Application
// Military Equipment Recognition Trainer

class MatherkApp {
  constructor() {
    this.playerName = '';
    this.currentQuestion = 0;
    this.questions = [];
    this.score = 0;
    this.correctCount = 0;
    this.timer = null;
    this.timerStart = null;

    this.init();
  }

  init() {
    // Bind form submit
    document.getElementById('start-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.startQuiz();
    });
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  }

  startQuiz() {
    this.playerName = document.getElementById('player-name').value.trim();
    if (!this.playerName) return;

    // Generate questions
    this.generateQuestions();
    this.currentQuestion = 0;
    this.score = 0;
    this.correctCount = 0;

    // Update UI
    document.getElementById('total-q').textContent = this.questions.length;
    document.getElementById('score').textContent = '0';

    this.showScreen('quiz');
    this.showQuestion();

    // Save session to backend
    this.saveSession();
  }

  generateQuestions() {
    // Shuffle vehicles and create questions
    const shuffled = [...VEHICLES].sort(() => Math.random() - 0.5);
    this.questions = [];

    // Create 16 questions (each vehicle appears twice)
    for (let i = 0; i < CONFIG.questionsPerSession; i++) {
      const vehicle = shuffled[i % shuffled.length];
      this.questions.push({
        vehicle: vehicle,
        options: this.generateOptions(vehicle)
      });
    }

    // Shuffle questions
    this.questions.sort(() => Math.random() - 0.5);
  }

  generateOptions(correctVehicle) {
    // Get 3 wrong options from same type if possible
    const sameType = VEHICLES.filter(v => v.id !== correctVehicle.id && v.type === correctVehicle.type);
    const otherType = VEHICLES.filter(v => v.id !== correctVehicle.id && v.type !== correctVehicle.type);

    let wrong = [];

    // Prefer same type for harder questions
    if (sameType.length >= 2) {
      wrong = sameType.sort(() => Math.random() - 0.5).slice(0, 2);
      wrong.push(otherType[Math.floor(Math.random() * otherType.length)]);
    } else {
      wrong = [...sameType, ...otherType].sort(() => Math.random() - 0.5).slice(0, 3);
    }

    // Combine and shuffle
    const options = [correctVehicle, ...wrong].sort(() => Math.random() - 0.5);
    return options;
  }

  showQuestion() {
    if (this.currentQuestion >= this.questions.length) {
      this.endQuiz();
      return;
    }

    const q = this.questions[this.currentQuestion];

    // Update progress
    document.getElementById('current-q').textContent = this.currentQuestion + 1;
    const progress = ((this.currentQuestion) / this.questions.length) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;

    // Build question HTML
    const html = `
      <div class="question-card">
        <div class="question-image">
          <img
            src="${q.vehicle.image}"
            alt="Vehicle"
            onload="this.classList.add('loaded')"
            onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%23161616%22 width=%22400%22 height=%22300%22/><text x=%22200%22 y=%22150%22 fill=%22%23333%22 text-anchor=%22middle%22 font-size=%2216%22>Afbeelding laden...</text></svg>'; this.classList.add('loaded')"
          >
          <div class="image-loader"></div>
        </div>
        <div class="options-container">
          ${q.options.map(opt => `
            <button class="option-button" data-id="${opt.id}">
              ${opt.name}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('quiz-content').innerHTML = html;

    // Bind option clicks
    document.querySelectorAll('.option-button').forEach(btn => {
      btn.addEventListener('click', () => this.handleAnswer(btn.dataset.id, q.vehicle.id));
    });

    // Start timer
    this.startTimer();
  }

  startTimer() {
    this.timerStart = Date.now();
    const timerFill = document.getElementById('timer-fill');
    timerFill.style.width = '100%';
    timerFill.classList.remove('warning', 'danger');

    clearInterval(this.timer);

    this.timer = setInterval(() => {
      const elapsed = Date.now() - this.timerStart;
      const remaining = Math.max(0, CONFIG.timePerQuestion - elapsed);
      const percent = (remaining / CONFIG.timePerQuestion) * 100;

      timerFill.style.width = `${percent}%`;

      if (percent < 30 && percent > 10) {
        timerFill.classList.add('warning');
      } else if (percent <= 10) {
        timerFill.classList.remove('warning');
        timerFill.classList.add('danger');
      }

      if (remaining <= 0) {
        clearInterval(this.timer);
        this.handleTimeout();
      }
    }, 50);
  }

  handleAnswer(selectedId, correctId) {
    clearInterval(this.timer);
    const responseTime = Date.now() - this.timerStart;
    const isCorrect = selectedId === correctId;

    // Disable all buttons
    document.querySelectorAll('.option-button').forEach(btn => {
      btn.classList.add('disabled');
      if (btn.dataset.id === correctId) {
        btn.classList.add('correct');
      } else if (btn.dataset.id === selectedId && !isCorrect) {
        btn.classList.add('incorrect');
      }
    });

    // Calculate points
    let points = 0;
    if (isCorrect) {
      points = CONFIG.points.correct;
      if (responseTime < CONFIG.points.speedThreshold) {
        points += CONFIG.points.speedBonus;
      }
      this.correctCount++;
    } else {
      points = CONFIG.points.wrong;
    }

    this.score += points;
    document.getElementById('score').textContent = Math.max(0, this.score);

    // Show feedback
    this.showFeedback(isCorrect, points, correctId, responseTime);
  }

  handleTimeout() {
    const q = this.questions[this.currentQuestion];

    // Disable all buttons and show correct
    document.querySelectorAll('.option-button').forEach(btn => {
      btn.classList.add('disabled');
      if (btn.dataset.id === q.vehicle.id) {
        btn.classList.add('correct');
      }
    });

    this.score += CONFIG.points.wrong;
    document.getElementById('score').textContent = Math.max(0, this.score);

    this.showFeedback(false, CONFIG.points.wrong, q.vehicle.id, CONFIG.timePerQuestion, true);
  }

  showFeedback(isCorrect, points, correctId, responseTime, timeout = false) {
    const correctVehicle = VEHICLES.find(v => v.id === correctId);

    const html = `
      <div class="feedback-overlay">
        <div class="feedback-card ${isCorrect ? 'correct' : 'incorrect'}">
          <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
          <div class="feedback-title">${isCorrect ? 'Correct!' : (timeout ? 'Tijd op!' : 'Fout!')}</div>
          <div class="feedback-answer">
            ${!isCorrect ? `Het was <strong>${correctVehicle.name}</strong>` : `${correctVehicle.name}`}
          </div>
          <div class="feedback-points">${points >= 0 ? '+' : ''}${points} pts</div>
          <button class="next-button">${this.currentQuestion + 1 >= this.questions.length ? 'Resultaten' : 'Volgende'}</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    document.querySelector('.next-button').addEventListener('click', () => {
      document.querySelector('.feedback-overlay').remove();
      this.currentQuestion++;
      this.showQuestion();
    });
  }

  endQuiz() {
    const accuracy = Math.round((this.correctCount / this.questions.length) * 100);
    const rank = this.getRank();

    const html = `
      <div class="results-score">
        <div class="label">Eindresultaat</div>
        <div class="value">${Math.max(0, this.score)}<span class="unit">pts</span></div>
      </div>
      <div class="results-name">${this.playerName}</div>
      <div class="results-stats">
        <div><span>${this.correctCount}</span>/${this.questions.length} correct</div>
        <div><span>${accuracy}%</span> accuracy</div>
      </div>
      <div class="results-rank">${rank}</div>
      <button class="restart-button" onclick="location.reload()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
          <path d="M1 4v6h6M23 20v-6h-6"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
        </svg>
        Opnieuw
      </button>
    `;

    document.getElementById('results-content').innerHTML = html;
    this.showScreen('results');

    // Save results
    this.saveResults(accuracy);
  }

  getRank() {
    if (this.score >= 150) return 'EXPERT';
    if (this.score >= 100) return 'GEVORDERD';
    if (this.score >= 60) return 'BEKWAAM';
    if (this.score >= 30) return 'BEGINNER';
    return 'REKRUUT';
  }

  async saveSession() {
    try {
      await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_name: this.playerName, unit: 'Web' })
      });
    } catch (e) {
      console.log('Offline mode');
    }
  }

  async saveResults(accuracy) {
    try {
      // This would save to the backend leaderboard
      console.log('Results saved:', { name: this.playerName, score: this.score, accuracy });
    } catch (e) {
      console.log('Offline mode');
    }
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  new MatherkApp();
});
