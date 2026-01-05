// MATHERK - Quiz Engine
// Interactieve Materieel Herkenning Test

class MATHERKQuiz {
  constructor() {
    this.sessionId = null;
    this.participantName = '';
    this.unit = '';
    this.currentQuestion = 0;
    this.questions = [];
    this.score = 0;
    this.startTime = null;
    this.questionStartTime = null;
    this.answers = [];
    this.difficulty = 'MEDIUM';
    this.timerInterval = null;
  }

  // Initialiseer quiz
  async init() {
    this.bindEvents();
    this.showScreen('start-screen');
  }

  bindEvents() {
    // Start form
    document.getElementById('start-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.startQuiz();
    });

    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.difficulty = e.target.dataset.difficulty;
      });
    });

    // Restart button
    document.getElementById('restart-btn')?.addEventListener('click', () => {
      location.reload();
    });

    // Leaderboard button
    document.getElementById('leaderboard-btn')?.addEventListener('click', () => {
      this.showLeaderboard();
    });

    // Export button
    document.getElementById('export-btn')?.addEventListener('click', () => {
      window.open('/api/export/csv', '_blank');
    });

    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showScreen('start-screen');
      });
    });
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId)?.classList.add('active');
  }

  async startQuiz() {
    this.participantName = document.getElementById('participant-name').value.trim();
    this.unit = document.getElementById('unit').value.trim() || 'Onbekend';

    if (!this.participantName) {
      alert('Vul je naam in');
      return;
    }

    // Start session in backend
    try {
      const response = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participant_name: this.participantName,
          unit: this.unit
        })
      });

      const data = await response.json();
      this.sessionId = data.session_id;
    } catch (error) {
      console.error('Kon sessie niet starten:', error);
    }

    // Genereer vragen
    this.generateQuestions();
    this.startTime = Date.now();
    this.currentQuestion = 0;
    this.score = 0;

    this.showScreen('quiz-screen');
    this.showQuestion();
  }

  generateQuestions() {
    const vehicleIds = Object.keys(VEHICLES);
    this.questions = [];

    // Shuffle vehicles
    const shuffled = vehicleIds.sort(() => Math.random() - 0.5);

    // Genereer mix van vraag types
    shuffled.forEach((vehicleId, index) => {
      // Herkenningsvraag
      this.questions.push({
        type: 'identification',
        vehicleId: vehicleId,
        imageType: this.getImageType(index)
      });

      // Engagement vraag
      this.questions.push({
        type: 'engagement',
        vehicleId: vehicleId
      });
    });

    // Shuffle alle vragen
    this.questions = this.questions.sort(() => Math.random() - 0.5);

    // Limiteer tot 16 vragen voor een sessie
    this.questions = this.questions.slice(0, 16);
  }

  getImageType(index) {
    const types = ['main', 'terrain', 'main', 'terrain'];
    return types[index % types.length];
  }

  showQuestion() {
    if (this.currentQuestion >= this.questions.length) {
      this.endQuiz();
      return;
    }

    const question = this.questions[this.currentQuestion];
    const vehicle = VEHICLES[question.vehicleId];
    const diffSettings = DIFFICULTY[this.difficulty];

    // Update progress
    document.getElementById('question-number').textContent = this.currentQuestion + 1;
    document.getElementById('total-questions').textContent = this.questions.length;
    document.getElementById('current-score').textContent = this.score;

    const quizContent = document.getElementById('quiz-content');

    if (question.type === 'identification') {
      this.showIdentificationQuestion(vehicle, question.imageType, diffSettings);
    } else {
      this.showEngagementQuestion(vehicle);
    }

    // Start timer
    this.questionStartTime = Date.now();
    this.startTimer(diffSettings.timeLimit);
  }

  showIdentificationQuestion(vehicle, imageType, diffSettings) {
    const quizContent = document.getElementById('quiz-content');
    const imageUrl = vehicle.images[imageType] || vehicle.images.main;

    // Genereer foute opties
    const allVehicles = Object.values(VEHICLES);
    const wrongOptions = allVehicles
      .filter(v => v.id !== vehicle.id && v.category === vehicle.category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    // Als niet genoeg in dezelfde categorie, pak random
    while (wrongOptions.length < 3) {
      const randomVehicle = allVehicles[Math.floor(Math.random() * allVehicles.length)];
      if (randomVehicle.id !== vehicle.id && !wrongOptions.find(v => v.id === randomVehicle.id)) {
        wrongOptions.push(randomVehicle);
      }
    }

    // Shuffle opties
    const options = [vehicle, ...wrongOptions.slice(0, 3)].sort(() => Math.random() - 0.5);

    quizContent.innerHTML = `
      <div class="question-container identification">
        <h2 class="question-title">IDENTIFICEER DIT VOERTUIG</h2>
        <div class="image-container">
          <img src="${imageUrl}" alt="Voertuig" class="vehicle-image" onerror="this.src='images/placeholder.png'">
          <div class="image-overlay ${imageType === 'terrain' ? 'terrain-mode' : ''}">
            ${imageType === 'terrain' ? '<span class="terrain-badge">TERREIN CONDITIE</span>' : ''}
          </div>
        </div>
        <div class="timer-bar">
          <div class="timer-fill" id="timer-fill"></div>
        </div>
        <div class="options-grid">
          ${options.map(opt => `
            <button class="option-btn" data-answer="${opt.id}">
              <span class="option-name">${opt.name}</span>
              <span class="option-type">${opt.type}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    // Bind click events
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => this.submitIdentificationAnswer(btn.dataset.answer, vehicle.id));
    });
  }

  showEngagementQuestion(vehicle) {
    const quizContent = document.getElementById('quiz-content');
    const imageUrl = vehicle.images.main;

    quizContent.innerHTML = `
      <div class="question-container engagement">
        <h2 class="question-title">ENGAGEMENT: ${vehicle.name}</h2>
        <p class="question-subtitle">Klik op de meest effectieve trefplek om dit voertuig uit te schakelen</p>
        <div class="engagement-container">
          <div class="vehicle-target" id="vehicle-target">
            <img src="${imageUrl}" alt="${vehicle.name}" class="target-image" id="target-image">
            <svg class="hotspot-overlay" id="hotspot-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
              <!-- Hotspots worden dynamisch toegevoegd -->
            </svg>
            <div class="click-indicator" id="click-indicator"></div>
          </div>
        </div>
        <div class="timer-bar">
          <div class="timer-fill" id="timer-fill"></div>
        </div>
        <div class="vehicle-info">
          <span class="info-badge">${vehicle.type}</span>
          <span class="info-badge">${vehicle.armament.split(',')[0]}</span>
          <span class="info-badge">${vehicle.weight}</span>
        </div>
      </div>
    `;

    // Bind click event op afbeelding
    const targetContainer = document.getElementById('vehicle-target');
    targetContainer.addEventListener('click', (e) => this.handleEngagementClick(e, vehicle));
  }

  handleEngagementClick(event, vehicle) {
    const container = document.getElementById('vehicle-target');
    const rect = container.getBoundingClientRect();

    // Bereken klik positie als percentage
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Toon klik indicator
    const indicator = document.getElementById('click-indicator');
    indicator.style.left = `${x}%`;
    indicator.style.top = `${y}%`;
    indicator.classList.add('visible');

    // Check of klik een weak point raakt
    this.submitEngagementAnswer(x, y, vehicle);
  }

  async submitIdentificationAnswer(userAnswer, correctAnswer) {
    clearInterval(this.timerInterval);
    const responseTime = Date.now() - this.questionStartTime;
    const isCorrect = userAnswer === correctAnswer;
    const vehicle = VEHICLES[correctAnswer];

    let points = 0;
    if (isCorrect) {
      points = SCORING.CORRECT_ID;
      if (responseTime < SCORING.SPEED_BONUS_THRESHOLD) {
        points += SCORING.SPEED_BONUS;
      }
      points *= DIFFICULTY[this.difficulty].pointMultiplier;
    } else {
      points = SCORING.WRONG_ID;
    }

    points = Math.round(points);
    this.score += points;

    // Toon feedback
    this.showAnswerFeedback(isCorrect, points, {
      type: 'identification',
      correct: vehicle.name,
      given: VEHICLES[userAnswer]?.name || 'Onbekend'
    });

    // Verstuur naar backend
    await this.recordAnswer('identification', correctAnswer, userAnswer, correctAnswer, isCorrect, points, responseTime);
  }

  async submitEngagementAnswer(x, y, vehicle) {
    clearInterval(this.timerInterval);
    const responseTime = Date.now() - this.questionStartTime;

    // Vind dichtstbijzijnde weak point
    let closestPoint = null;
    let closestDistance = Infinity;
    let hitPoint = null;

    vehicle.weakPoints.forEach(wp => {
      const distance = Math.sqrt(Math.pow(x - wp.x, 2) + Math.pow(y - wp.y, 2));
      if (distance < wp.radius) {
        if (!hitPoint || wp.points > hitPoint.points) {
          hitPoint = wp;
        }
      }
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = wp;
      }
    });

    let points = 0;
    let isCorrect = false;
    let hitDescription = '';

    if (hitPoint) {
      isCorrect = true;
      points = hitPoint.points;
      if (hitPoint.critical) {
        points += SCORING.CRITICAL_HIT_BONUS;
        hitDescription = `KRITIEKE TREFFER: ${hitPoint.name}`;
      } else {
        hitDescription = `TREFFER: ${hitPoint.name}`;
      }
      if (responseTime < SCORING.SPEED_BONUS_THRESHOLD) {
        points += SCORING.SPEED_BONUS;
      }
      points *= DIFFICULTY[this.difficulty].pointMultiplier;
    } else {
      points = SCORING.WRONG_ENGAGEMENT;
      hitDescription = `MISSER - Beste optie was: ${closestPoint?.name}`;
    }

    points = Math.round(points);
    this.score += points;

    // Toon weak points overlay
    this.showWeakPointsOverlay(vehicle, hitPoint);

    // Toon feedback
    setTimeout(() => {
      this.showAnswerFeedback(isCorrect, points, {
        type: 'engagement',
        description: hitDescription,
        weakPoint: hitPoint || closestPoint
      });
    }, 1500);

    // Verstuur naar backend
    await this.recordAnswer(
      'engagement',
      vehicle.id,
      hitPoint?.id || 'miss',
      vehicle.weakPoints.filter(wp => wp.critical).map(wp => wp.id).join(','),
      isCorrect,
      points,
      responseTime
    );
  }

  showWeakPointsOverlay(vehicle, hitPoint) {
    const overlay = document.getElementById('hotspot-overlay');
    if (!overlay) return;

    let svgContent = '';
    vehicle.weakPoints.forEach(wp => {
      const isHit = hitPoint && hitPoint.id === wp.id;
      const colorClass = wp.critical ? 'critical' : 'normal';
      svgContent += `
        <circle
          cx="${wp.x}" cy="${wp.y}" r="${wp.radius}"
          class="weak-point ${colorClass} ${isHit ? 'hit' : ''}"
          opacity="0.7"
        />
        <text x="${wp.x}" y="${wp.y + wp.radius + 5}" class="weak-point-label" text-anchor="middle" font-size="3">
          ${wp.name}
        </text>
      `;
    });

    overlay.innerHTML = svgContent;
    overlay.classList.add('visible');
  }

  showAnswerFeedback(isCorrect, points, details) {
    const feedbackHtml = `
      <div class="feedback-overlay ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="feedback-content">
          <div class="feedback-icon">${isCorrect ? '✓' : '✗'}</div>
          <div class="feedback-title">${isCorrect ? 'CORRECT!' : 'FOUT!'}</div>
          <div class="feedback-points ${points >= 0 ? 'positive' : 'negative'}">
            ${points >= 0 ? '+' : ''}${points} punten
          </div>
          ${details.type === 'identification' ? `
            <div class="feedback-details">
              <p>Correct antwoord: <strong>${details.correct}</strong></p>
              ${!isCorrect ? `<p>Jouw antwoord: ${details.given}</p>` : ''}
            </div>
          ` : `
            <div class="feedback-details">
              <p>${details.description}</p>
              ${details.weakPoint ? `<p class="weak-point-info">${details.weakPoint.description}</p>` : ''}
            </div>
          `}
          <button class="next-btn" id="next-question-btn">
            ${this.currentQuestion + 1 >= this.questions.length ? 'BEKIJK RESULTATEN' : 'VOLGENDE VRAAG'}
          </button>
        </div>
      </div>
    `;

    const quizContent = document.getElementById('quiz-content');
    quizContent.insertAdjacentHTML('beforeend', feedbackHtml);

    document.getElementById('next-question-btn').addEventListener('click', () => {
      this.currentQuestion++;
      this.showQuestion();
    });
  }

  async recordAnswer(type, vehicleId, userAnswer, correctAnswer, isCorrect, points, responseTime) {
    if (!this.sessionId) return;

    try {
      await fetch(`/api/session/${this.sessionId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question_type: type,
          vehicle_id: vehicleId,
          user_answer: userAnswer,
          correct_answer: correctAnswer,
          is_correct: isCorrect,
          points_earned: points,
          response_time_ms: responseTime
        })
      });
    } catch (error) {
      console.error('Kon antwoord niet opslaan:', error);
    }
  }

  startTimer(duration) {
    const timerFill = document.getElementById('timer-fill');
    if (!timerFill) return;

    const startTime = Date.now();
    timerFill.style.width = '100%';

    this.timerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const percentage = (remaining / duration) * 100;

      timerFill.style.width = `${percentage}%`;

      if (percentage < 30) {
        timerFill.classList.add('warning');
      }
      if (percentage < 10) {
        timerFill.classList.add('critical');
      }

      if (remaining <= 0) {
        clearInterval(this.timerInterval);
        this.handleTimeout();
      }
    }, 50);
  }

  handleTimeout() {
    const question = this.questions[this.currentQuestion];
    const vehicle = VEHICLES[question.vehicleId];

    if (question.type === 'identification') {
      this.showAnswerFeedback(false, SCORING.WRONG_ID, {
        type: 'identification',
        correct: vehicle.name,
        given: 'TIJD OP!'
      });
    } else {
      this.showAnswerFeedback(false, SCORING.WRONG_ENGAGEMENT, {
        type: 'engagement',
        description: 'TIJD OP!',
        weakPoint: vehicle.weakPoints.find(wp => wp.critical)
      });
    }

    this.score += question.type === 'identification' ? SCORING.WRONG_ID : SCORING.WRONG_ENGAGEMENT;
    this.recordAnswer(question.type, question.vehicleId, 'timeout', '', false, SCORING.WRONG_ID, DIFFICULTY[this.difficulty].timeLimit);
  }

  async endQuiz() {
    clearInterval(this.timerInterval);

    // Complete session in backend
    let sessionData = null;
    if (this.sessionId) {
      try {
        const response = await fetch(`/api/session/${this.sessionId}/complete`, {
          method: 'POST'
        });
        sessionData = await response.json();
      } catch (error) {
        console.error('Kon sessie niet afsluiten:', error);
      }
    }

    const totalTime = Math.round((Date.now() - this.startTime) / 1000);
    const accuracy = sessionData?.accuracy || 0;

    this.showScreen('results-screen');

    document.getElementById('results-content').innerHTML = `
      <div class="results-card">
        <h2>MISSIE VOLTOOID</h2>
        <div class="participant-info">
          <span class="name">${this.participantName}</span>
          <span class="unit">${this.unit}</span>
        </div>

        <div class="score-display">
          <div class="final-score">${this.score}</div>
          <div class="score-label">PUNTEN</div>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${accuracy}%</div>
            <div class="stat-label">Nauwkeurigheid</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}</div>
            <div class="stat-label">Totale Tijd</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.questions.length}</div>
            <div class="stat-label">Vragen</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${this.difficulty}</div>
            <div class="stat-label">Moeilijkheid</div>
          </div>
        </div>

        <div class="rank-badge ${this.getRankClass()}">
          ${this.getRank()}
        </div>

        <div class="action-buttons">
          <button class="btn primary" id="restart-btn">OPNIEUW</button>
          <button class="btn secondary" id="leaderboard-btn">SCOREBORD</button>
          <button class="btn secondary" id="export-btn">EXPORTEER CSV</button>
        </div>
      </div>
    `;

    // Re-bind buttons
    document.getElementById('restart-btn')?.addEventListener('click', () => location.reload());
    document.getElementById('leaderboard-btn')?.addEventListener('click', () => this.showLeaderboard());
    document.getElementById('export-btn')?.addEventListener('click', () => window.open('/api/export/csv', '_blank'));
  }

  getRank() {
    if (this.score >= 200) return 'EXPERT';
    if (this.score >= 150) return 'GEVORDERD';
    if (this.score >= 100) return 'BEKWAAM';
    if (this.score >= 50) return 'BEGINNER';
    return 'REKRUUT';
  }

  getRankClass() {
    if (this.score >= 200) return 'rank-expert';
    if (this.score >= 150) return 'rank-advanced';
    if (this.score >= 100) return 'rank-competent';
    if (this.score >= 50) return 'rank-beginner';
    return 'rank-recruit';
  }

  async showLeaderboard() {
    this.showScreen('leaderboard-screen');

    try {
      const response = await fetch('/api/leaderboard?limit=20');
      const leaderboard = await response.json();

      document.getElementById('leaderboard-content').innerHTML = `
        <div class="leaderboard-card">
          <h2>SCOREBORD</h2>
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Naam</th>
                <th>Eenheid</th>
                <th>Score</th>
                <th>Nauwkeurigheid</th>
              </tr>
            </thead>
            <tbody>
              ${leaderboard.map((entry, index) => `
                <tr class="${entry.participant_name === this.participantName ? 'highlight' : ''}">
                  <td class="rank">${index + 1}</td>
                  <td class="name">${entry.participant_name}</td>
                  <td class="unit">${entry.unit || '-'}</td>
                  <td class="score">${entry.score}</td>
                  <td class="accuracy">${entry.accuracy}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <button class="btn primary back-btn">TERUG</button>
        </div>
      `;

      document.querySelector('.back-btn')?.addEventListener('click', () => {
        if (this.score > 0) {
          this.showScreen('results-screen');
        } else {
          this.showScreen('start-screen');
        }
      });
    } catch (error) {
      document.getElementById('leaderboard-content').innerHTML = `
        <div class="error-message">
          <p>Kon scorebord niet laden</p>
          <button class="btn primary back-btn">TERUG</button>
        </div>
      `;
    }
  }
}

// Start de quiz wanneer pagina geladen is
document.addEventListener('DOMContentLoaded', () => {
  const quiz = new MATHERKQuiz();
  quiz.init();
});
