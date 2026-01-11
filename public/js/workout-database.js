// Workout database
const workoutDatabase = {
    strength: {
        beginner: {
            upper: [
                { name: 'Bench Press', sets: 3, reps: '5-6', rest: '3 min', notes: 'Main strength focus' },
                { name: 'Bent Over Rows', sets: 3, reps: '5-6', rest: '3 min', notes: 'Balance pushing with pulling' },
                { name: 'Overhead Press', sets: 3, reps: '5-6', rest: '2.5 min', notes: '' },
                { name: 'Pull-ups/Assisted', sets: 3, reps: '6-8', rest: '2 min', notes: '' },
                { name: 'Barbell Curls', sets: 2, reps: '6-8', rest: '90 sec', notes: '' }
            ],
            lower: [
                { name: 'Squat', sets: 3, reps: '5-6', rest: '3 min', notes: 'Main strength focus' },
                { name: 'Deadlift', sets: 2, reps: '3-5', rest: '3 min', notes: 'Heavy compound' },
                { name: 'Leg Press', sets: 3, reps: '6-8', rest: '2 min', notes: '' },
                { name: 'Leg Curls', sets: 3, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Calf Raises', sets: 3, reps: '10-12', rest: '60 sec', notes: '' }
            ]
        },
        intermediate: {
            upper: [
                { name: 'Bench Press', sets: 4, reps: '4-6', rest: '3 min', notes: 'Main strength focus' },
                { name: 'Incline Barbell Press', sets: 3, reps: '6-8', rest: '2.5 min', notes: '' },
                { name: 'Barbell Rows', sets: 4, reps: '4-6', rest: '3 min', notes: 'Heavy compound' },
                { name: 'Weighted Pull-ups', sets: 3, reps: '5-8', rest: '2.5 min', notes: '' },
                { name: 'Barbell Curls', sets: 3, reps: '6-8', rest: '2 min', notes: '' },
                { name: 'Tricep Dips', sets: 3, reps: '6-8', rest: '2 min', notes: '' }
            ],
            lower: [
                { name: 'Squat', sets: 4, reps: '4-6', rest: '3 min', notes: 'Main strength focus' },
                { name: 'Front Squat', sets: 3, reps: '5-6', rest: '2.5 min', notes: '' },
                { name: 'Deadlift', sets: 3, reps: '3-5', rest: '3 min', notes: 'Heavy compound' },
                { name: 'Walking Lunges', sets: 3, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Leg Curls', sets: 3, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Calf Raises', sets: 3, reps: '10-15', rest: '60 sec', notes: '' }
            ]
        },
        advanced: {
            upper: [
                { name: 'Bench Press', sets: 5, reps: '3-5', rest: '3.5 min', notes: 'Main strength focus' },
                { name: 'Incline Barbell Press', sets: 4, reps: '4-6', rest: '3 min', notes: '' },
                { name: 'Barbell Rows', sets: 5, reps: '3-5', rest: '3.5 min', notes: 'Heavy compound' },
                { name: 'Weighted Pull-ups', sets: 4, reps: '4-6', rest: '3 min', notes: '' },
                { name: 'Barbell Curls', sets: 3, reps: '5-7', rest: '2 min', notes: '' },
                { name: 'Close Grip Bench', sets: 3, reps: '5-7', rest: '2 min', notes: '' }
            ],
            lower: [
                { name: 'Squat', sets: 5, reps: '3-5', rest: '3.5 min', notes: 'Main strength focus' },
                { name: 'Front Squat', sets: 4, reps: '4-6', rest: '3 min', notes: '' },
                { name: 'Deadlift', sets: 4, reps: '2-4', rest: '3.5 min', notes: 'Heavy compound' },
                { name: 'Bulgarian Split Squat', sets: 3, reps: '6-8', rest: '2 min', notes: '' },
                { name: 'Leg Curls', sets: 3, reps: '6-8', rest: '2 min', notes: '' },
                { name: 'Weighted Calf Raises', sets: 4, reps: '8-12', rest: '90 sec', notes: '' }
            ]
        }
    },
    muscle: {
        beginner: {
            upper: [
                { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Dumbbell Flyes', sets: 3, reps: '10-12', rest: '60 sec', notes: '' },
                { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '60 sec', notes: '' },
                { name: 'Dumbbell Curls', sets: 3, reps: '10-12', rest: '60 sec', notes: '' },
                { name: 'Tricep Rope Pushdowns', sets: 3, reps: '10-12', rest: '60 sec', notes: '' }
            ],
            lower: [
                { name: 'Barbell Squat', sets: 4, reps: '8-10', rest: '2 min', notes: '' },
                { name: 'Leg Press', sets: 3, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Leg Curls', sets: 3, reps: '10-12', rest: '60 sec', notes: '' },
                { name: 'Leg Extensions', sets: 3, reps: '10-12', rest: '60 sec', notes: '' },
                { name: 'Calf Raises', sets: 4, reps: '12-15', rest: '60 sec', notes: '' }
            ]
        },
        intermediate: {
            upper: [
                { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90 sec', notes: 'Primary focus' },
                { name: 'Incline Dumbbell Press', sets: 3, reps: '9-11', rest: '90 sec', notes: '' },
                { name: 'Dumbbell Flyes', sets: 3, reps: '10-12', rest: '60 sec', notes: '' },
                { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '90 sec', notes: 'Primary focus' },
                { name: 'Seal Rows', sets: 3, reps: '10-12', rest: '60 sec', notes: '' },
                { name: 'Dumbbell Curls', sets: 3, reps: '10-12', rest: '70 sec', notes: '' },
                { name: 'Tricep Dips', sets: 3, reps: '9-11', rest: '70 sec', notes: '' }
            ],
            lower: [
                { name: 'Barbell Squat', sets: 4, reps: '8-10', rest: '2 min', notes: 'Primary focus' },
                { name: 'Incline Leg Press', sets: 3, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Leg Curls', sets: 3, reps: '10-12', rest: '70 sec', notes: '' },
                { name: 'Leg Extensions', sets: 3, reps: '10-12', rest: '70 sec', notes: '' },
                { name: 'Hack Squat', sets: 3, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Calf Raises', sets: 4, reps: '12-15', rest: '60 sec', notes: '' }
            ]
        },
        advanced: {
            upper: [
                { name: 'Barbell Bench Press', sets: 5, reps: '8-10', rest: '2 min', notes: 'Primary focus' },
                { name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Dumbbell Flyes', sets: 3, reps: '10-12', rest: '60 sec', notes: '' },
                { name: 'Barbell Rows', sets: 5, reps: '8-10', rest: '2 min', notes: 'Primary focus' },
                { name: 'T-Bar Rows', sets: 3, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Dumbbell Curls', sets: 3, reps: '10-12', rest: '70 sec', notes: '' },
                { name: 'EZ Bar Curls', sets: 3, reps: '10-12', rest: '70 sec', notes: '' },
                { name: 'Tricep Dips', sets: 4, reps: '8-10', rest: '90 sec', notes: '' }
            ],
            lower: [
                { name: 'Barbell Squat', sets: 5, reps: '8-10', rest: '2 min', notes: 'Primary focus' },
                { name: 'Front Squat', sets: 3, reps: '8-10', rest: '2 min', notes: '' },
                { name: 'Leg Press', sets: 4, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Leg Curls', sets: 4, reps: '10-12', rest: '70 sec', notes: '' },
                { name: 'Leg Extensions', sets: 4, reps: '10-12', rest: '70 sec', notes: '' },
                { name: 'Hack Squat', sets: 3, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Calf Raises', sets: 5, reps: '12-15', rest: '60 sec', notes: '' }
            ]
        }
    },
    endurance: {
        beginner: {
            cardio: [
                { name: 'Treadmill Running', sets: 1, reps: '20-30 min', rest: '2-3 min walk', notes: 'Steady pace' },
                { name: 'Bodyweight Circuits', sets: 3, reps: '40 sec on / 20 sec off', rest: '2 min', notes: 'Burpees, mountain climbers, jumping jacks' },
                { name: 'Rowing Machine', sets: 1, reps: '15-20 min', rest: 'N/A', notes: 'Steady state' }
            ],
            strength: [
                { name: 'Dumbbell Squats', sets: 3, reps: '12-15', rest: '60 sec', notes: '' },
                { name: 'Push-ups', sets: 3, reps: '10-15', rest: '60 sec', notes: '' },
                { name: 'Lunges', sets: 3, reps: '12-15', rest: '60 sec', notes: '' },
                { name: 'Dumbbell Rows', sets: 3, reps: '12-15', rest: '60 sec', notes: '' }
            ]
        },
        intermediate: {
            cardio: [
                { name: 'Interval Running', sets: 1, reps: '30-40 min mixed', rest: '2-3 min', notes: '2 min hard / 1 min easy' },
                { name: 'HIIT Circuits', sets: 4, reps: '45 sec on / 15 sec off', rest: '2 min', notes: 'Mixed cardio exercises' },
                { name: 'Rowing Machine', sets: 1, reps: '20-25 min', rest: 'N/A', notes: 'Include sprint intervals' }
            ],
            strength: [
                { name: 'Barbell Squats', sets: 3, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Push-ups', sets: 3, reps: '15-20', rest: '60 sec', notes: '' },
                { name: 'Bulgarian Split Squats', sets: 3, reps: '12-15', rest: '60 sec', notes: '' },
                { name: 'Barbell Rows', sets: 3, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '90 sec', notes: '' }
            ]
        },
        advanced: {
            cardio: [
                { name: 'Long Distance Run', sets: 1, reps: '45-60 min', rest: 'N/A', notes: 'Steady pace, conversational' },
                { name: 'Advanced HIIT', sets: 5, reps: '50 sec on / 10 sec off', rest: '2.5 min', notes: 'High intensity mixed cardio' },
                { name: 'Rowing Machine', sets: 1, reps: '30-40 min', rest: 'N/A', notes: 'Heavy intervals mixed in' }
            ],
            strength: [
                { name: 'Barbell Squats', sets: 4, reps: '8-10', rest: '2 min', notes: '' },
                { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '2 min', notes: '' },
                { name: 'Pull-ups', sets: 4, reps: '10-15', rest: '90 sec', notes: '' },
                { name: 'Single Leg Deadlifts', sets: 3, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Push-ups', sets: 3, reps: '20+', rest: '60 sec', notes: '' }
            ]
        }
    },
    'weight-loss': {
        beginner: {
            cardio: [
                { name: 'Brisk Walking', sets: 1, reps: '30-40 min', rest: 'N/A', notes: 'Moderate pace' },
                { name: 'Jump Rope', sets: 3, reps: '1 min', rest: '1 min', notes: '' },
                { name: 'Cycling', sets: 1, reps: '20-30 min', rest: 'N/A', notes: 'Moderate resistance' }
            ],
            strength: [
                { name: 'Bodyweight Squats', sets: 3, reps: '15-20', rest: '60 sec', notes: '' },
                { name: 'Push-ups', sets: 3, reps: '10-15', rest: '60 sec', notes: '' },
                { name: 'Walking Lunges', sets: 3, reps: '12-15', rest: '60 sec', notes: '' },
                { name: 'Burpees', sets: 2, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Mountain Climbers', sets: 3, reps: '20', rest: '60 sec', notes: '' }
            ]
        },
        intermediate: {
            cardio: [
                { name: 'Running/Jogging', sets: 1, reps: '30-45 min', rest: 'N/A', notes: 'Steady pace' },
                { name: 'Jump Rope HIIT', sets: 4, reps: '45 sec on / 15 sec off', rest: '2 min', notes: '' },
                { name: 'Cycling Intervals', sets: 1, reps: '35-45 min mixed', rest: 'N/A', notes: '2 min hard / 1 min easy' }
            ],
            strength: [
                { name: 'Barbell Squats', sets: 3, reps: '12-15', rest: '90 sec', notes: '' },
                { name: 'Push-ups', sets: 3, reps: '15-20', rest: '60 sec', notes: '' },
                { name: 'Dumbbell Lunges', sets: 3, reps: '12-15', rest: '60 sec', notes: '' },
                { name: 'Dumbbell Rows', sets: 3, reps: '12-15', rest: '60 sec', notes: '' },
                { name: 'Burpees', sets: 3, reps: '12-15', rest: '60 sec', notes: '' },
                { name: 'Jump Squats', sets: 3, reps: '15-20', rest: '60 sec', notes: '' }
            ]
        },
        advanced: {
            cardio: [
                { name: 'Long Run', sets: 1, reps: '45-60 min', rest: 'N/A', notes: 'Steady pace' },
                { name: 'Advanced HIIT', sets: 5, reps: '50 sec on / 10 sec off', rest: '2 min', notes: 'Complex movements' },
                { name: 'Cycling', sets: 1, reps: '45-60 min', rest: 'N/A', notes: 'Heavy intervals' }
            ],
            strength: [
                { name: 'Barbell Squats', sets: 4, reps: '10-12', rest: '90 sec', notes: '' },
                { name: 'Push-ups', sets: 4, reps: '20+', rest: '60 sec', notes: '' },
                { name: 'Dumbbell Complex', sets: 4, reps: '10-12', rest: '90 sec', notes: 'Multiple movements' },
                { name: 'Kettlebell Swings', sets: 3, reps: '20', rest: '60 sec', notes: '' },
                { name: 'Battle Ropes', sets: 3, reps: '30-40 sec', rest: '60 sec', notes: '' },
                { name: 'Sled Pushes', sets: 3, reps: '30-40m', rest: '90 sec', notes: '' }
            ]
        }
    },
    balanced: {
        beginner: {
            workout: [
                { name: 'Barbell Squats', sets: 3, reps: '8-10', rest: '2 min', notes: '' },
                { name: 'Bench Press', sets: 3, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Barbell Rows', sets: 3, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Overhead Press', sets: 2, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Dumbbell Curls', sets: 2, reps: '10-12', rest: '60 sec', notes: '' },
                { name: 'Tricep Dips', sets: 2, reps: '8-10', rest: '60 sec', notes: '' },
                { name: 'Leg Extensions', sets: 2, reps: '12-15', rest: '60 sec', notes: '' }
            ]
        },
        intermediate: {
            workout: [
                { name: 'Barbell Squats', sets: 4, reps: '8-10', rest: '2 min', notes: '' },
                { name: 'Bench Press', sets: 4, reps: '8-10', rest: '2 min', notes: '' },
                { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '2 min', notes: '' },
                { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Pull-ups', sets: 3, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Dumbbell Curls', sets: 3, reps: '10-12', rest: '70 sec', notes: '' },
                { name: 'Tricep Dips', sets: 3, reps: '8-10', rest: '70 sec', notes: '' },
                { name: 'Leg Curls', sets: 2, reps: '12-15', rest: '60 sec', notes: '' }
            ]
        },
        advanced: {
            workout: [
                { name: 'Barbell Squats', sets: 4, reps: '6-8', rest: '2.5 min', notes: 'Strength focus' },
                { name: 'Incline Barbell Press', sets: 3, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Barbell Rows', sets: 4, reps: '6-8', rest: '2.5 min', notes: 'Strength focus' },
                { name: 'Overhead Press', sets: 3, reps: '6-8', rest: '2 min', notes: '' },
                { name: 'Weighted Pull-ups', sets: 3, reps: '6-8', rest: '2 min', notes: '' },
                { name: 'Barbell Curls', sets: 3, reps: '8-10', rest: '90 sec', notes: '' },
                { name: 'Tricep Dips', sets: 3, reps: '6-8', rest: '2 min', notes: '' },
                { name: 'Leg Curls', sets: 3, reps: '10-12', rest: '70 sec', notes: '' }
            ]
        }
    }
};
