// WorkoutBrothers - Main Application

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initProducts();
    initCart();
    initWorkoutGenerator();
    initNavigation();
});

// Initialize navigation
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            navigateToSection(target);
        });
    });
}

// Initialize workout generator
function initWorkoutGenerator() {
    const workoutForm = document.getElementById('workoutForm');
    if (workoutForm) {
        workoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            generateProgram();
        });
    }
}

// Generate workout program
function generateProgram() {
    // Get form values
    const weight = parseFloat(document.getElementById('weight').value);
    const goal = document.getElementById('goal').value;
    const experience = document.getElementById('experience').value;
    const sessionDuration = parseInt(document.getElementById('sessionDuration').value);
    const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked'))
        .map(cb => cb.value);

    // Validation
    hideError();

    if (!weight || weight < 50 || weight > 500) {
        showError('Veuillez entrer un poids valide entre 50 et 500 lbs');
        return;
    }

    if (!goal) {
        showError('Veuillez sélectionner un objectif principal');
        return;
    }

    if (!experience) {
        showError('Veuillez sélectionner votre niveau d\'expérience');
        return;
    }

    if (selectedDays.length === 0) {
        showError('Veuillez sélectionner au moins un jour d\'entraînement');
        return;
    }

    if (selectedDays.length > 6) {
        showError('Veuillez sélectionner au maximum 6 jours d\'entraînement');
        return;
    }

    // Generate the program
    const program = createProgram(weight, goal, experience, selectedDays, sessionDuration);
    displayProgram(program, goal, experience, selectedDays, sessionDuration);
    showSuccess('Programme généré avec succès !');
}

// Create workout program
function createProgram(weight, goal, experience, selectedDays, duration) {
    const program = {};

    // Get workout data
    const goalWorkouts = workoutDatabase[goal][experience];

    // Distribute workouts across selected days
    if (goal === 'endurance' || goal === 'weight-loss') {
        // Alternate cardio and strength
        let isCardio = true;
        selectedDays.forEach((day, index) => {
            if (isCardio) {
                program[day] = goalWorkouts.cardio[index % goalWorkouts.cardio.length];
            } else {
                program[day] = goalWorkouts.strength[index % goalWorkouts.strength.length];
            }
            isCardio = !isCardio;
        });
    } else if (goal === 'balanced') {
        // All days same workout structure
        selectedDays.forEach(day => {
            program[day] = goalWorkouts.workout;
        });
    } else {
        // Alternate upper and lower for strength/muscle goals
        let isUpper = true;
        selectedDays.forEach((day, index) => {
            program[day] = isUpper ? goalWorkouts.upper : goalWorkouts.lower;
            if (selectedDays.length > 1) isUpper = !isUpper;
        });
    }

    return program;
}

// Display workout program
function displayProgram(program, goal, experience, selectedDays, duration) {
    const schedule = document.getElementById('workoutSchedule');
    if (!schedule) return;
    
    schedule.innerHTML = '';

    let totalExercises = 0;
    let totalSets = 0;
    const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const restDays = allDays.filter(day => !selectedDays.includes(day));

    // Training days
    selectedDays.forEach(day => {
        const exercises = program[day];
        const dayEl = document.createElement('div');
        dayEl.className = 'workout-day';

        let dayHtml = `<h3>${day}</h3><ul class="exercise-list">`;

        if (Array.isArray(exercises)) {
            exercises.forEach(exercise => {
                totalExercises++;
                totalSets += exercise.sets;
                const details = `${exercise.sets} séries × ${exercise.reps}${exercise.notes ? ' (' + exercise.notes + ')' : ''}`;
                dayHtml += `<li class="exercise-item">
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-details">${details}<br>Repos: ${exercise.rest}</div>
                </li>`;
            });
        }

        dayHtml += '</ul>';
        dayEl.innerHTML = dayHtml;
        schedule.appendChild(dayEl);
    });

    // Rest days
    restDays.slice(0, 7 - selectedDays.length).forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.className = 'workout-day rest-day';
        dayEl.innerHTML = `
            <h3>${day}</h3>
            <div class="rest-content">
                <p>Jour de Repos & Récupération</p>
                <p>Récupération active, étirements ou cardio léger optionnel</p>
            </div>
        `;
        schedule.appendChild(dayEl);
    });

    // Update summary stats
    document.getElementById('totalDays').textContent = selectedDays.length;
    document.getElementById('totalExercises').textContent = totalExercises;
    document.getElementById('totalVolume').textContent = totalSets;
    document.getElementById('weeklyHours').textContent = (selectedDays.length * duration / 60).toFixed(1);

    document.getElementById('summaryStats').style.display = 'grid';
    document.getElementById('programInfo').style.display = 'none';

    // Show results
    document.getElementById('resultsContainer').classList.add('active');
    document.querySelector('.results-container').scrollIntoView({ behavior: 'smooth' });
}

// Copy program to clipboard
function copyToClipboard() {
    const weight = document.getElementById('weight').value;
    const goal = document.getElementById('goal').value;
    const experience = document.getElementById('experience').value;
    const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked'))
        .map(cb => cb.value);

    let text = 'PROGRAMME WORKOUT BROTHERS\n';
    text += '=========================\n\n';
    text += `Poids: ${weight} lbs\n`;
    text += `Objectif: ${goal.replace('-', ' ').toUpperCase()}\n`;
    text += `Expérience: ${experience}\n`;
    text += `Jours d'Entraînement: ${selectedDays.join(', ')}\n\n`;
    text += 'PROGRAMME D\'ENTRAÎNEMENT:\n';
    text += '==========================\n\n';

    document.querySelectorAll('.workout-day').forEach(day => {
        const title = day.querySelector('h3').textContent;
        text += `${title}:\n`;

        const exercises = day.querySelectorAll('.exercise-item');
        if (exercises.length === 0) {
            text += '  Jour de Repos & Récupération\n';
        } else {
            exercises.forEach(ex => {
                const name = ex.querySelector('.exercise-name').textContent;
                const details = ex.querySelector('.exercise-details').textContent;
                text += `  - ${name}\n    ${details.replace(/\n/g, '\n    ')}\n`;
            });
        }
        text += '\n';
    });

    navigator.clipboard.writeText(text).then(() => {
        const feedback = document.getElementById('copyFeedback');
        feedback.classList.add('active');
        setTimeout(() => feedback.classList.remove('active'), 2000);
    });
}

// Download program as text file
function downloadProgram() {
    const weight = document.getElementById('weight').value;
    const goal = document.getElementById('goal').value;
    const experience = document.getElementById('experience').value;
    const selectedDays = Array.from(document.querySelectorAll('input[name="days"]:checked'))
        .map(cb => cb.value);

    let content = 'PROGRAMME WORKOUT BROTHERS\n';
    content += '=========================\n\n';
    content += `Poids: ${weight} lbs\n`;
    content += `Objectif: ${goal.replace('-', ' ').toUpperCase()}\n`;
    content += `Expérience: ${experience}\n`;
    content += `Jours d'Entraînement: ${selectedDays.join(', ')}\n`;
    content += `Généré le: ${new Date().toLocaleString('fr-FR')}\n\n`;
    content += 'PROGRAMME D\'ENTRAÎNEMENT:\n';
    content += '==========================\n\n';

    document.querySelectorAll('.workout-day').forEach(day => {
        const title = day.querySelector('h3').textContent;
        content += `${title}:\n`;

        const exercises = day.querySelectorAll('.exercise-item');
        if (exercises.length === 0) {
            content += '  Jour de Repos & Récupération\n';
        } else {
            exercises.forEach(ex => {
                const name = ex.querySelector('.exercise-name').textContent;
                const details = ex.querySelector('.exercise-details').textContent;
                content += `  - ${name}\n    ${details.replace(/\n/g, '\n    ')}\n`;
            });
        }
        content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-brothers-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
