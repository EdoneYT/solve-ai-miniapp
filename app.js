// SolveAI Mini App - JavaScript

// Инициализация Telegram WebApp
const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Получаем данные пользователя из Telegram
const user = tg.initDataUnsafe?.user;

// Демонстрационные данные (в реальном приложении получать с сервера)
const demoData = {
  userId: user?.id || 123456789,
  name: user?.first_name + (user?.last_name ? ' ' + user.last_name : '') || 'Пользователь',
  status: 'PRO',
  plan: 'premium',
  experience: 1250,
  level: 3,
  totalRequests: 156,
  requestsToday: 12,
  voiceRequestsToday: 3,
  achievements: ['first_steps', 'curious', 'pro_user'],
  challenges: [
    {
      id: 1,
      type: 'daily_requests',
      description: 'Сделайте 20 запросов сегодня',
      progress: 12,
      required: 20,
      reward: 10,
      completed: false,
      claimed: false
    },
    {
      id: 2,
      type: 'voice_messages',
      description: 'Отправьте 5 голосовых сообщений',
      progress: 3,
      required: 5,
      reward: 5,
      completed: false,
      claimed: false
    },
    {
      id: 3,
      type: 'total_requests',
      description: 'Сделайте 50 запросов за неделю',
      progress: 45,
      required: 50,
      reward: 15,
      completed: false,
      claimed: false
    }
  ],
  favorites: [
    { question: 'Что такое JavaScript?', answer: 'Язык программирования...' },
    { question: 'Как решить уравнение?', answer: 'Нужно перенести...' }
  ],
  requestsHistory: [15, 22, 18, 25, 12, 30, 20]
};

// Конфигурация уровней
const LEVELS = [
  { level: 1, name: 'Новичок', minXp: 0, maxXp: 100, icon: '🌱' },
  { level: 2, name: 'Любитель', minXp: 100, maxXp: 500, icon: '📚' },
  { level: 3, name: 'Эксперт', minXp: 500, maxXp: 1500, icon: '🎓' },
  { level: 4, name: 'Мастер', minXp: 1500, maxXp: 5000, icon: '🏆' },
  { level: 5, name: 'Легенда', minXp: 5000, maxXp: Infinity, icon: '👑' }
];

// Достижения
const ACHIEVEMENTS = {
  first_steps: { name: 'Первый шаг', icon: '🌱' },
  curious: { name: 'Любознательный', icon: '🔍' },
  pro_user: { name: 'PRO-пользователь', icon: '💎' },
  social: { name: 'Социальный', icon: '👥' },
  scholar: { name: 'Учёный', icon: '📚' },
  speedster: { name: 'Спринтер', icon: '⚡' },
  master: { name: 'Мастер', icon: '🎯' },
  legend: { name: 'Легенда', icon: '👑' },
  voice_first: { name: 'Голосовой старт', icon: '🎤' },
  voice_active: { name: 'Голосовой актив', icon: '🎙️' },
  voice_master: { name: 'Голосовой мастер', icon: '🎧' }
};

// Обновление UI
function updateUI() {
  // Основная информация
  document.getElementById('userName').textContent = demoData.name;
  document.getElementById('userStatus').textContent = `${demoData.status} ${demoData.plan ? '(' + demoData.plan.toUpperCase() + ')' : ''}`;
  
  // Уровень и XP
  const levelConfig = LEVELS.find(l => l.level === demoData.level) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === demoData.level + 1);
  
  document.getElementById('levelName').textContent = `${levelConfig.icon} ${levelConfig.name}`;
  document.getElementById('levelBadge').textContent = `Уровень ${demoData.level}`;
  
  const xpInLevel = demoData.experience - levelConfig.minXp;
  const xpNeeded = (nextLevel ? nextLevel.minXp : levelConfig.maxXp) - levelConfig.minXp;
  const progressPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
  
  document.getElementById('xpProgress').style.width = `${progressPercent}%`;
  document.getElementById('xpCurrent').textContent = `${demoData.experience} XP`;
  document.getElementById('xpNext').textContent = nextLevel ? `${nextLevel.minXp} XP` : 'MAX';
  
  // Челленджи
  renderChallenges();
  
  // Избранное
  renderFavorites();
  
  // Достижения
  renderAchievements();
  
  // График
  renderChart();
  
  // Настройка темы Telegram
  if (tg.colorScheme === 'dark') {
    document.body.style.backgroundColor = '#1c1c1e';
  }
}

// Рендер челленджей
function renderChallenges() {
  const container = document.getElementById('challengesList');
  
  if (demoData.challenges.length === 0) {
    container.innerHTML = '<p class="text-muted text-center">Нет активных челленджей</p>';
    return;
  }
  
  container.innerHTML = demoData.challenges.map(c => {
    const progressPercent = Math.min(100, Math.round((c.progress / c.required) * 100));
    const isCompleted = c.completed && !c.claimed;
    
    return `
      <div class="challenge-item ${isCompleted ? 'completed' : ''}">
        <div class="d-flex justify-content-between align-items-center">
          <span class="fw-medium">${c.description}</span>
          ${isCompleted ? '<span class="badge bg-success">Готово!</span>' : ''}
        </div>
        <div class="challenge-progress">
          <div class="challenge-progress-bar" style="width: ${progressPercent}%"></div>
        </div>
        <div class="d-flex justify-content-between">
          <small class="text-muted">${c.progress}/${c.required}</small>
          <small class="text-muted">🎁 +${c.reward} запросов</small>
        </div>
      </div>
    `;
  }).join('');
}

// Рендер избранного
function renderFavorites() {
  const container = document.getElementById('favoritesList');
  
  if (demoData.favorites.length === 0) {
    container.innerHTML = '<p class="text-muted text-center">Нет избранных запросов</p>';
    return;
  }
  
  container.innerHTML = demoData.favorites.map(f => `
    <div class="favorite-item">
      <div class="favorite-question">❓ ${f.question}</div>
      <div class="favorite-answer">💡 ${f.answer}</div>
    </div>
  `).join('');
}

// Рендер достижений
function renderAchievements() {
  const container = document.getElementById('achievementsList');
  
  container.innerHTML = Object.entries(ACHIEVEMENTS).map(([id, achievement]) => {
    const unlocked = demoData.achievements.includes(id);
    return `
      <div class="achievement-item ${unlocked ? 'unlocked' : ''}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
      </div>
    `;
  }).join('');
}

// Рендер графика
function renderChart() {
  const ctx = document.getElementById('requestsChart').getContext('2d');
  
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [{
        label: 'Запросы',
        data: demoData.requestsHistory,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 10
          }
        }
      }
    }
  });
}

// Главное меню
tg.MainButton.setText('Закрыть');
tg.MainButton.onClick(() => tg.close());
tg.MainButton.show();

// Инициализация
updateUI();

// Сообщаем Telegram что приложение готово
tg.ready();
