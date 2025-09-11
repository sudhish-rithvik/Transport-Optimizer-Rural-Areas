// Application Data
const appData = {
  demo_users: [
    {"username": "admin", "password": "admin123", "role": "Administrator", "department": "Transport Department"},
    {"username": "manager", "password": "manager123", "role": "Operations Manager", "department": "Operations"},
    {"username": "operator", "password": "operator123", "role": "Field Operator", "department": "Field Operations"},
    {"username": "viewer", "password": "viewer123", "role": "Analytics Viewer", "department": "Analytics"}
  ],
  routes: [
    {"id": "tp_pc", "name": "Tiruppur to Pollachi", "distance": 85, "travel_time": 120, "current_buses": 12, "daily_passengers": 2800},
    {"id": "tp_cb", "name": "Tiruppur to Coimbatore", "distance": 65, "travel_time": 90, "current_buses": 18, "daily_passengers": 4200},
    {"id": "tp_sl", "name": "Tiruppur to Salem", "distance": 113, "travel_time": 150, "current_buses": 15, "daily_passengers": 3500}
  ],
  events_2025_2026: [
    {"date": "2025-09-12", "name": "Ganesh Chaturthi", "impact": 1.8, "type": "major", "days_away": 1},
    {"date": "2025-10-02", "name": "Gandhi Jayanti", "impact": 1.4, "type": "national", "days_away": 21},
    {"date": "2025-10-12", "name": "Vijaya Dashami", "impact": 1.7, "type": "major", "days_away": 31},
    {"date": "2025-11-01", "name": "Diwali", "impact": 1.9, "type": "major", "days_away": 51},
    {"date": "2025-11-15", "name": "Karthikai Deepam", "impact": 1.6, "type": "regional", "days_away": 65},
    {"date": "2025-12-25", "name": "Christmas", "impact": 1.5, "type": "national", "days_away": 105},
    {"date": "2026-01-14", "name": "Thai Pusam", "impact": 1.7, "type": "regional", "days_away": 125},
    {"date": "2026-01-26", "name": "Republic Day", "impact": 1.4, "type": "national", "days_away": 137},
    {"date": "2026-04-14", "name": "Tamil New Year", "impact": 1.8, "type": "regional", "days_away": 215}
  ],
  news_feed: [
    {"title": "Tamil Nadu announces new electric bus fleet for 2025", "summary": "State government plans to add 500 electric buses to improve sustainable transport across major cities", "category": "Infrastructure", "published": "2025-09-11"},
    {"title": "AI-powered traffic management system launched in Chennai", "summary": "New intelligent system reduces traffic congestion by 25% in pilot areas using machine learning algorithms", "category": "Technology", "published": "2025-09-10"},
    {"title": "Rural connectivity improved with new bus routes", "summary": "Transport department adds 15 new routes connecting remote villages to major economic centers", "category": "Expansion", "published": "2025-09-09"},
    {"title": "Digital ticketing system sees 80% adoption rate", "summary": "Electronic payment systems show strong uptake among commuters, reducing boarding time by 40%", "category": "Digital", "published": "2025-09-08"}
  ],
  weather: {
    "temperature": 29,
    "condition": "Partly Cloudy",
    "humidity": 68,
    "rainfall": 0,
    "weather_factor": 1.05,
    "icon": "⛅"
  },
  dashboard_stats: {
    "performance_today": 87.3,
    "active_buses": 45,
    "passengers_today": 8247,
    "weekly_savings": 52500,
    "prediction_accuracy": 89.2,
    "system_uptime": 99.7
  }
};

// Application State
let currentUser = null;
let charts = {};
let updateInterval = null;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Show loading screen
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('login-page').classList.remove('hidden');
  }, 2000);

  // Initialize event listeners
  initializeEventListeners();
  
  // Initialize charts (hidden initially)
  setTimeout(initializeCharts, 100);
}

function initializeEventListeners() {
  // Login form
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  
  // Demo user buttons
  document.querySelectorAll('.demo-user-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const username = this.getAttribute('data-username');
      const password = this.getAttribute('data-password');
      document.getElementById('username').value = username;
      document.getElementById('password').value = password;
      
      // Add visual feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'translateY(-2px)';
      }, 150);
    });
  });
  
  // Logout button
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
  
  // Navigation buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      navigateToSection(section);
    });
  });
  
  // Route selector
  document.getElementById('route-selector').addEventListener('change', updateAnalytics);
  
  // Schedule approval
  document.getElementById('approve-schedule').addEventListener('click', approveSchedule);
}

function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  const user = appData.demo_users.find(u => u.username === username && u.password === password);
  
  if (user) {
    currentUser = user;
    showNotification(`Welcome, ${user.role}!`);
    
    setTimeout(() => {
      document.getElementById('login-page').classList.add('hidden');
      document.getElementById('main-app').classList.remove('hidden');
      document.getElementById('user-badge').textContent = `Welcome, ${user.role}`;
      
      // Start real-time updates
      startRealTimeUpdates();
      
      // Initialize dashboard data
      updateDashboardData();
      populateEvents();
      populateNews();
    }, 1000);
  } else {
    showNotification('Invalid credentials. Please try demo credentials.', 'error');
  }
}

function handleLogout() {
  currentUser = null;
  stopRealTimeUpdates();
  
  document.getElementById('main-app').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
  
  // Reset form
  document.getElementById('login-form').reset();
  
  showNotification('Logged out successfully');
}

function navigateToSection(sectionName) {
  // Update navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
  
  // Update sections
  document.querySelectorAll('.app-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(`${sectionName}-section`).classList.add('active');
  
  // Update charts if needed
  setTimeout(() => {
    if (sectionName === 'analytics') {
      updateAnalyticsCharts();
    } else if (sectionName === 'scheduler') {
      updateSchedulerCharts();
    }
  }, 100);
}

function initializeCharts() {
  // Passenger Flow Chart
  const passengerCtx = document.getElementById('passenger-flow-chart').getContext('2d');
  charts.passengerFlow = new Chart(passengerCtx, {
    type: 'line',
    data: {
      labels: ['6AM', '8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
      datasets: [{
        label: 'Passengers',
        data: [120, 450, 280, 350, 320, 520, 480, 200],
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        fill: true,
        tension: 0.4
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
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  });

  // Demand Chart
  const demandCtx = document.getElementById('demand-chart').getContext('2d');
  charts.demand = new Chart(demandCtx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Actual Demand',
          data: [2800, 3200, 2900, 3100, 3400, 4200, 3800],
          backgroundColor: '#1FB8CD'
        },
        {
          label: 'Predicted Demand',
          data: [2750, 3180, 2920, 3080, 3450, 4150, 3750],
          backgroundColor: '#FFC185'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Performance Chart
  const performanceCtx = document.getElementById('performance-chart').getContext('2d');
  charts.performance = new Chart(performanceCtx, {
    type: 'doughnut',
    data: {
      labels: ['On Time', 'Delayed', 'Early'],
      datasets: [{
        data: [75, 15, 10],
        backgroundColor: ['#1FB8CD', '#B4413C', '#5D878F']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  // Allocation Chart
  const allocationCtx = document.getElementById('allocation-chart').getContext('2d');
  charts.allocation = new Chart(allocationCtx, {
    type: 'pie',
    data: {
      labels: ['Tiruppur-Pollachi', 'Tiruppur-Coimbatore', 'Tiruppur-Salem'],
      datasets: [{
        data: [15, 22, 18],
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

function updateDashboardData() {
  const stats = appData.dashboard_stats;
  
  // Add small random variations for real-time effect
  const variation = () => (Math.random() - 0.5) * 0.1;
  
  document.getElementById('performance-value').textContent = 
    (stats.performance_today + variation()).toFixed(1) + '%';
  document.getElementById('active-buses').textContent = 
    Math.round(stats.active_buses + variation() * 2);
  document.getElementById('passengers-today').textContent = 
    (Math.round(stats.passengers_today + variation() * 100)).toLocaleString();
  document.getElementById('weekly-savings').textContent = 
    '₹' + (Math.round(stats.weekly_savings + variation() * 1000)).toLocaleString();
  
  // Update passenger flow chart with new data
  if (charts.passengerFlow) {
    const newData = charts.passengerFlow.data.datasets[0].data.map(val => 
      Math.max(0, val + (Math.random() - 0.5) * 20)
    );
    charts.passengerFlow.data.datasets[0].data = newData;
    charts.passengerFlow.update('none');
  }
}

function updateAnalytics() {
  const selectedRoute = document.getElementById('route-selector').value;
  const route = appData.routes.find(r => r.id === selectedRoute);
  
  if (route) {
    // Update accuracy based on route
    const accuracies = { tp_pc: 89.2, tp_cb: 91.5, tp_sl: 87.8 };
    document.querySelector('.accuracy-value').textContent = accuracies[selectedRoute] + '%';
    
    updateAnalyticsCharts();
  }
}

function updateAnalyticsCharts() {
  if (charts.demand) {
    const selectedRoute = document.getElementById('route-selector').value;
    const routeData = {
      tp_pc: [2600, 2800, 2700, 2900, 3100, 3800, 3400],
      tp_cb: [3800, 4200, 3900, 4100, 4400, 5200, 4800],
      tp_sl: [3200, 3500, 3300, 3400, 3700, 4500, 4100]
    };
    
    charts.demand.data.datasets[0].data = routeData[selectedRoute];
    charts.demand.data.datasets[1].data = routeData[selectedRoute].map(val => val * 0.98);
    charts.demand.update();
  }
}

function updateSchedulerCharts() {
  if (charts.allocation) {
    // Update allocation for tomorrow (Ganesh Chaturthi)
    charts.allocation.data.datasets[0].data = [15, 22, 18];
    charts.allocation.update();
  }
}

function populateEvents() {
  const eventsContainer = document.getElementById('events-list');
  eventsContainer.innerHTML = '';
  
  appData.events_2025_2026.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card fade-in';
    
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    eventCard.innerHTML = `
      <div class="event-header">
        <div class="event-date">${formattedDate}</div>
        <div class="event-type ${event.type}">${event.type}</div>
      </div>
      <div class="event-name">${event.name}</div>
      <div class="event-impact">
        <span>Impact: <span class="impact-multiplier">${event.impact}x</span></span>
        <span class="days-away">${event.days_away} days away</span>
      </div>
    `;
    
    eventsContainer.appendChild(eventCard);
  });
}

function populateNews() {
  const newsContainer = document.getElementById('news-feed');
  newsContainer.innerHTML = '';
  
  appData.news_feed.forEach(news => {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item fade-in';
    
    const newsDate = new Date(news.published);
    const formattedDate = newsDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
    
    newsItem.innerHTML = `
      <div class="news-header">
        <div class="news-category">${news.category}</div>
        <div class="news-date">${formattedDate}</div>
      </div>
      <h3 class="news-title">${news.title}</h3>
      <p class="news-summary">${news.summary}</p>
    `;
    
    newsContainer.appendChild(newsItem);
  });
}

function approveSchedule() {
  showNotification('Schedule approved for September 12, 2025!');
  
  // Animate the button
  const btn = document.getElementById('approve-schedule');
  btn.textContent = 'Approved ✓';
  btn.style.background = '#1FB8CD';
  btn.disabled = true;
  
  setTimeout(() => {
    btn.textContent = 'Approve Schedule';
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
}

function startRealTimeUpdates() {
  updateInterval = setInterval(() => {
    updateDashboardData();
  }, 30000); // Update every 30 seconds
}

function stopRealTimeUpdates() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
}

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const messageElement = notification.querySelector('.notification-message');
  
  messageElement.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Progressive Web App features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful');
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Handle app installation
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  deferredPrompt = e;
  // Could show install button here
});

// Simulate real-time data changes
function simulateDataChanges() {
  // Simulate small variations in metrics
  const elements = [
    'performance-value',
    'active-buses', 
    'passengers-today',
    'weekly-savings'
  ];
  
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      // Add subtle animation class
      element.style.transition = 'all 0.3s ease';
    }
  });
}

// Initialize data simulation
setTimeout(simulateDataChanges, 3000);

// Handle window resize for charts
window.addEventListener('resize', function() {
  Object.values(charts).forEach(chart => {
    if (chart && chart.resize) {
      chart.resize();
    }
  });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.altKey) {
    switch(e.code) {
      case 'Digit1':
        navigateToSection('dashboard');
        break;
      case 'Digit2':
        navigateToSection('analytics');
        break;
      case 'Digit3':
        navigateToSection('scheduler');
        break;
      case 'Digit4':
        navigateToSection('events');
        break;
      case 'Digit5':
        navigateToSection('news');
        break;
    }
  }
});

// Add smooth scrolling for section changes
function smoothScrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Override navigation to include smooth scrolling
const originalNavigateToSection = navigateToSection;
navigateToSection = function(sectionName) {
  smoothScrollToTop();
  setTimeout(() => originalNavigateToSection(sectionName), 300);
};

// Performance monitoring
function trackPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('App loaded in:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }
      }, 0);
    });
  }
}

trackPerformance();