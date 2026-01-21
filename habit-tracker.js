// ================================
// Habit Tracker - Enhanced Goals System
// ================================

// State
let currentDate = new Date();
let habits = [];
let groupedGoals = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateDateDisplay();
    renderAll();
    setupEventListeners();
});

// ================================
// Data Management
// ================================

function loadData() {
    const savedHabits = localStorage.getItem('habits');
    const savedGroupedGoals = localStorage.getItem('groupedGoals');
    
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
    } else {
        // Initialize with sample data
        habits = [
            {
                id: 'habit-1',
                name: 'Code',
                emoji: '💻',
                type: 'daily',
                scheduled: true,
                scheduledTime: '20:30',
                goals: {
                    weekly: { enabled: true, target: 5, current: 0 }
                },
                completions: {}
            },
            {
                id: 'habit-2',
                name: 'Workout',
                emoji: '💪',
                type: 'daily',
                scheduled: true,
                scheduledTime: '07:00',
                goals: {
                    weekly: { enabled: true, target: 5, current: 0 }
                },
                completions: {}
            },
            {
                id: 'habit-3',
                name: 'Avoid Vaping',
                emoji: '🚫',
                type: 'daily',
                scheduled: false,
                goals: {
                    streak: { enabled: true, target: 30, current: 0, best: 0 }
                },
                completions: {}
            },
            {
                id: 'habit-4',
                name: 'Read the Bible',
                emoji: '📖',
                type: 'daily',
                scheduled: true,
                scheduledTime: '21:00',
                goals: {},
                completions: {}
            },
            {
                id: 'habit-5',
                name: 'Music',
                emoji: '🎵',
                type: 'daily',
                scheduled: false,
                goals: {},
                completions: {}
            },
            {
                id: 'habit-6',
                name: 'Writing',
                emoji: '✍️',
                type: 'daily',
                scheduled: false,
                goals: {},
                completions: {}
            },
            {
                id: 'habit-7',
                name: 'Painting',
                emoji: '🎨',
                type: 'daily',
                scheduled: false,
                goals: {},
                completions: {}
            },
            {
                id: 'habit-8',
                name: 'Drawing',
                emoji: '✏️',
                type: 'daily',
                scheduled: false,
                goals: {},
                completions: {}
            }
        ];
    }
    
    if (savedGroupedGoals) {
        groupedGoals = JSON.parse(savedGroupedGoals);
    } else {
        // Initialize with sample grouped goals
        groupedGoals = [
            {
                id: 'group-1',
                name: 'Creative Goal',
                emoji: '🎨',
                type: 'aggregate',
                habitIds: ['habit-5', 'habit-6', 'habit-7', 'habit-8'],
                period: 'week',
                target: 5
            },
            {
                id: 'group-2',
                name: 'Health & Spirit',
                emoji: '💪',
                type: 'combined',
                habitIds: ['habit-2', 'habit-4'],
                period: 'week',
                target: 3
            }
        ];
    }
}

function saveData() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('groupedGoals', JSON.stringify(groupedGoals));
}

// ================================
// Date Utilities
// ================================

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getDateKey(date) {
    return date.toISOString().split('T')[0];
}

function updateDateDisplay() {
    const dateElement = document.getElementById('current-date');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    if (getDateKey(currentDate) === getDateKey(today)) {
        dateElement.textContent = '📅 Today - ' + formatDate(currentDate);
    } else {
        dateElement.textContent = '📅 ' + formatDate(currentDate);
    }
}

function getStartOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getStartOfMonth(date = new Date()) {
    const d = new Date(date);
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getDaysBetween(startDate, endDate) {
    const days = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    
    return days;
}

// ================================
// Goal Calculations
// ================================

function calculateWeeklyProgress(habit) {
    const startOfWeek = getStartOfWeek(currentDate);
    const endOfWeek = new Date(currentDate);
    const days = getDaysBetween(startOfWeek, endOfWeek);
    
    let count = 0;
    days.forEach(day => {
        const key = getDateKey(day);
        if (habit.completions[key] === true) {
            count++;
        }
    });
    
    return count;
}

function calculateMonthlyProgress(habit) {
    const startOfMonth = getStartOfMonth(currentDate);
    const endOfMonth = new Date(currentDate);
    const days = getDaysBetween(startOfMonth, endOfMonth);
    
    let count = 0;
    days.forEach(day => {
        const key = getDateKey(day);
        if (habit.completions[key] === true) {
            count++;
        }
    });
    
    return count;
}

function calculateStreak(habit) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);
    
    // Check if completed today or yesterday (for streak continuation)
    const todayKey = getDateKey(today);
    const yesterdayKey = getDateKey(new Date(today.getTime() - 86400000));
    
    if (habit.completions[todayKey] === true) {
        // Start from today
        checkDate = new Date(today);
    } else if (habit.completions[yesterdayKey] === true) {
        // Start from yesterday
        checkDate = new Date(today.getTime() - 86400000);
    } else {
        return 0; // Streak broken
    }
    
    // Count backwards
    while (true) {
        const key = getDateKey(checkDate);
        if (habit.completions[key] === true) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

function calculateGroupedGoalProgress(group) {
    const groupHabits = habits.filter(h => group.habitIds.includes(h.id));
    const startDate = group.period === 'week' ? getStartOfWeek(currentDate) : getStartOfMonth(currentDate);
    const endDate = new Date(currentDate);
    const days = getDaysBetween(startDate, endDate);
    
    if (group.type === 'aggregate') {
        // Count any completions from any habit in the group
        let totalCompletions = 0;
        days.forEach(day => {
            const key = getDateKey(day);
            groupHabits.forEach(habit => {
                if (habit.completions[key] === true) {
                    totalCompletions++;
                }
            });
        });
        return totalCompletions;
    } else if (group.type === 'combined') {
        // Count days where ALL habits were completed
        let combinedDays = 0;
        days.forEach(day => {
            const key = getDateKey(day);
            const allCompleted = groupHabits.every(habit => habit.completions[key] === true);
            if (allCompleted) {
                combinedDays++;
            }
        });
        return combinedDays;
    } else if (group.type === 'mutual_exclusion') {
        // Calculate streak of days with NO completions
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let streak = 0;
        let checkDate = new Date(today);
        
        while (true) {
            const key = getDateKey(checkDate);
            const anyCompleted = groupHabits.some(habit => habit.completions[key] === true);
            if (!anyCompleted) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return streak;
    }
    
    return 0;
}

// ================================
// Rendering
// ================================

function renderAll() {
    renderDailyHabits();
    renderGroupedGoals();
    renderAnytimeTasks();
}

function renderDailyHabits() {
    const container = document.getElementById('daily-habits-list');
    const dailyHabits = habits.filter(h => h.type === 'daily');
    
    if (dailyHabits.length === 0) {
        container.innerHTML = '<p style="opacity: 0.6; text-align: center; padding: 20px;">No daily habits yet. Add one to get started!</p>';
        return;
    }
    
    container.innerHTML = dailyHabits.map(habit => {
        const dateKey = getDateKey(currentDate);
        const isCompleted = habit.completions[dateKey] === true;
        
        let progressHTML = '';
        
        // Weekly goal progress
        if (habit.goals.weekly && habit.goals.weekly.enabled) {
            const current = calculateWeeklyProgress(habit);
            const target = habit.goals.weekly.target;
            const percentage = Math.min((current / target) * 100, 100);
            
            progressHTML = `
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%;"></div>
                    </div>
                    <div class="goal-info">${current}/${target} times this week</div>
                </div>
            `;
        }
        
        // Streak goal progress
        if (habit.goals.streak && habit.goals.streak.enabled) {
            const current = calculateStreak(habit);
            const target = habit.goals.streak.target;
            const percentage = Math.min((current / target) * 100, 100);
            
            progressHTML = `
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-fill avoidance" style="width: ${percentage}%;"></div>
                    </div>
                    <div class="goal-info">${current}-day streak (Goal: ${target} days)</div>
                </div>
            `;
        }
        
        // Monthly goal progress
        if (habit.goals.monthly && habit.goals.monthly.enabled) {
            const current = calculateMonthlyProgress(habit);
            const target = habit.goals.monthly.target;
            const percentage = Math.min((current / target) * 100, 100);
            
            progressHTML = `
                <div class="progress-bar-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%;"></div>
                    </div>
                    <div class="goal-info">${current}/${target} times this month</div>
                </div>
            `;
        }
        
        return `
            <div class="task-item ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}">
                <div class="task-content">
                    <div class="task-header">
                        <div class="task-name-with-icon">
                            <div class="task-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleHabit('${habit.id}')"></div>
                            <span>${habit.emoji ? habit.emoji + ' ' : ''}${habit.name}</span>
                        </div>
                        ${habit.scheduled ? `<span class="scheduled-time">${habit.scheduledTime}</span>` : ''}
                    </div>
                    ${progressHTML}
                </div>
            </div>
        `;
    }).join('');
}

function renderGroupedGoals() {
    const container = document.getElementById('grouped-goals-list');
    
    if (groupedGoals.length === 0) {
        container.innerHTML = '<p style="opacity: 0.6; text-align: center; padding: 20px;">No grouped goals yet. Create one to track multiple habits together!</p>';
        return;
    }
    
    container.innerHTML = groupedGoals.map(group => {
        const current = calculateGroupedGoalProgress(group);
        const target = group.target;
        const percentage = Math.min((current / target) * 100, 100);
        
        const goalText = group.type === 'mutual_exclusion' 
            ? `${current}-day streak`
            : `${current}/${target} this ${group.period}`;
        
        const groupHabits = habits.filter(h => group.habitIds.includes(h.id));
        const subtasksHTML = groupHabits.map(habit => {
            const dateKey = getDateKey(currentDate);
            const isCompleted = habit.completions[dateKey] === true;
            
            // Get days completed this week/month
            const startDate = group.period === 'week' ? getStartOfWeek(currentDate) : getStartOfMonth(currentDate);
            const days = getDaysBetween(startDate, currentDate);
            const completedDays = days.filter(day => habit.completions[getDateKey(day)] === true);
            const dayNames = completedDays.map(day => 
                day.toLocaleDateString('en-US', { weekday: 'short' })
            ).join(', ') || '—';
            
            return `
                <div class="subtask-item">
                    <div class="subtask-indicator ${isCompleted ? 'completed' : ''}"></div>
                    <span>${habit.emoji ? habit.emoji + ' ' : ''}${habit.name}</span>
                    <span class="subtask-days">${dayNames}</span>
                </div>
            `;
        }).join('');
        
        return `
            <div class="task-item grouped-goal" data-group-id="${group.id}" onclick="toggleGroupedGoal('${group.id}')">
                <div class="task-content">
                    <div class="task-header">
                        <div class="task-name-with-icon">
                            <span>${group.emoji ? group.emoji + ' ' : ''}${group.name}</span>
                            <span class="expand-icon">▼</span>
                        </div>
                        <div class="goal-info">${goalText}</div>
                    </div>
                    <div class="grouped-progress-bar">
                        <div class="grouped-progress-fill" style="width: ${percentage}%;"></div>
                    </div>
                    <div class="subtasks">
                        ${subtasksHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderAnytimeTasks() {
    const container = document.getElementById('anytime-tasks-list');
    const anytimeTasks = habits.filter(h => h.type === 'anytime');
    
    if (anytimeTasks.length === 0) {
        container.innerHTML = '<p style="opacity: 0.6; text-align: center; padding: 20px;">No anytime tasks yet. Add flexible tasks that don\'t need daily commitment!</p>';
        return;
    }
    
    container.innerHTML = anytimeTasks.map(habit => {
        const dateKey = getDateKey(currentDate);
        const isCompleted = habit.completions[dateKey] === true;
        
        return `
            <div class="task-item ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}">
                <div class="task-content">
                    <div class="task-header">
                        <div class="task-name-with-icon">
                            <div class="task-checkbox ${isCompleted ? 'checked' : ''}" onclick="toggleHabit('${habit.id}')"></div>
                            <span>${habit.emoji ? habit.emoji + ' ' : ''}${habit.name}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ================================
// Event Handlers
// ================================

function setupEventListeners() {
    // Date navigation
    document.getElementById('prev-day').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
        renderAll();
    });
    
    document.getElementById('today-btn').addEventListener('click', () => {
        currentDate = new Date();
        updateDateDisplay();
        renderAll();
    });
    
    document.getElementById('next-day').addEventListener('click', () => {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
        renderAll();
    });
    
    // Add habit modals
    document.getElementById('add-daily-habit').addEventListener('click', () => {
        openHabitModal('daily');
    });
    
    document.getElementById('add-anytime-task').addEventListener('click', () => {
        openHabitModal('anytime');
    });
    
    document.getElementById('close-habit-modal').addEventListener('click', closeHabitModal);
    
    document.getElementById('habit-form').addEventListener('submit', saveHabit);
    
    // Grouped goal modal
    document.getElementById('add-grouped-goal').addEventListener('click', openGroupedGoalModal);
    document.getElementById('close-grouped-goal-modal').addEventListener('click', closeGroupedGoalModal);
    document.getElementById('grouped-goal-form').addEventListener('submit', saveGroupedGoal);
    
    // Toggle inputs based on checkboxes
    document.getElementById('habit-scheduled').addEventListener('change', (e) => {
        document.getElementById('scheduled-time-group').style.display = e.target.checked ? 'flex' : 'none';
    });
    
    document.getElementById('goal-weekly-enabled').addEventListener('change', (e) => {
        document.getElementById('goal-weekly-input').style.display = e.target.checked ? 'flex' : 'none';
    });
    
    document.getElementById('goal-streak-enabled').addEventListener('change', (e) => {
        document.getElementById('goal-streak-input').style.display = e.target.checked ? 'flex' : 'none';
    });
    
    document.getElementById('goal-monthly-enabled').addEventListener('change', (e) => {
        document.getElementById('goal-monthly-input').style.display = e.target.checked ? 'flex' : 'none';
    });
}

function toggleHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const dateKey = getDateKey(currentDate);
    habit.completions[dateKey] = !habit.completions[dateKey];
    
    saveData();
    renderAll();
}

function toggleGroupedGoal(groupId) {
    const element = document.querySelector(`[data-group-id="${groupId}"]`);
    if (element) {
        element.classList.toggle('expanded');
    }
}

// ================================
// Modal Management
// ================================

function openHabitModal(type = 'daily') {
    document.getElementById('habit-type').value = type;
    document.getElementById('habit-modal-title').textContent = type === 'daily' ? 'Add Daily Habit' : 'Add Anytime Task';
    document.getElementById('habit-modal').classList.add('active');
    document.getElementById('habit-form').reset();
}

function closeHabitModal() {
    document.getElementById('habit-modal').classList.remove('active');
}

function saveHabit(e) {
    e.preventDefault();
    
    const name = document.getElementById('habit-name').value;
    const emoji = document.getElementById('habit-emoji').value;
    const type = document.getElementById('habit-type').value;
    const scheduled = document.getElementById('habit-scheduled').checked;
    const scheduledTime = document.getElementById('habit-time').value;
    
    const habit = {
        id: 'habit-' + Date.now(),
        name,
        emoji,
        type,
        scheduled,
        scheduledTime: scheduled ? scheduledTime : null,
        goals: {},
        completions: {}
    };
    
    // Add goals if enabled
    if (document.getElementById('goal-weekly-enabled').checked) {
        habit.goals.weekly = {
            enabled: true,
            target: parseInt(document.getElementById('goal-weekly-target').value),
            current: 0
        };
    }
    
    if (document.getElementById('goal-streak-enabled').checked) {
        habit.goals.streak = {
            enabled: true,
            target: parseInt(document.getElementById('goal-streak-target').value),
            current: 0,
            best: 0
        };
    }
    
    if (document.getElementById('goal-monthly-enabled').checked) {
        habit.goals.monthly = {
            enabled: true,
            target: parseInt(document.getElementById('goal-monthly-target').value),
            current: 0
        };
    }
    
    habits.push(habit);
    saveData();
    renderAll();
    closeHabitModal();
}

function openGroupedGoalModal() {
    // Populate habit selection list
    const container = document.getElementById('habit-selection-list');
    const dailyHabits = habits.filter(h => h.type === 'daily');
    
    if (dailyHabits.length < 2) {
        alert('You need at least 2 daily habits to create a grouped goal. Please add more habits first.');
        return;
    }
    
    container.innerHTML = dailyHabits.map(habit => `
        <div class="habit-checkbox-item">
            <input type="checkbox" id="habit-select-${habit.id}" value="${habit.id}">
            <label for="habit-select-${habit.id}">${habit.emoji ? habit.emoji + ' ' : ''}${habit.name}</label>
        </div>
    `).join('');
    
    document.getElementById('grouped-goal-modal').classList.add('active');
    document.getElementById('grouped-goal-form').reset();
}

function closeGroupedGoalModal() {
    document.getElementById('grouped-goal-modal').classList.remove('active');
}

function saveGroupedGoal(e) {
    e.preventDefault();
    
    const name = document.getElementById('group-name').value;
    const emoji = document.getElementById('group-emoji').value;
    const type = document.getElementById('group-type').value;
    const period = document.getElementById('group-period').value;
    const target = parseInt(document.getElementById('group-target').value);
    
    // Get selected habits
    const selectedHabits = Array.from(document.querySelectorAll('#habit-selection-list input:checked'))
        .map(input => input.value);
    
    if (selectedHabits.length < 2) {
        alert('Please select at least 2 habits for the grouped goal.');
        return;
    }
    
    const group = {
        id: 'group-' + Date.now(),
        name,
        emoji,
        type,
        habitIds: selectedHabits,
        period,
        target
    };
    
    groupedGoals.push(group);
    saveData();
    renderAll();
    closeGroupedGoalModal();
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
