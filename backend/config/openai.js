const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI-powered product recommendations
 * @param {Object} userProfile - User preferences and fitness level
 * @param {string} category - Product category (e.g., 'equipment', 'supplements')
 * @returns {Promise<Object>} Product recommendations with details
 */
async function generateProductRecommendations(userProfile, category) {
  try {
    const prompt = `Based on the following user profile and fitness goals, recommend 5 high-quality products in the ${category} category:

User Profile:
- Fitness Level: ${userProfile.fitnessLevel}
- Goals: ${userProfile.goals.join(', ')}
- Budget: $${userProfile.budget}
- Age: ${userProfile.age}
- Current Equipment: ${userProfile.currentEquipment?.join(', ') || 'None'}

Please provide detailed recommendations including:
1. Product name and brand
2. Why it's suitable for this user
3. Estimated price range
4. Key features and benefits
5. Where to purchase`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert fitness equipment and supplement advisor with extensive knowledge of quality products and their applications.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return {
      success: true,
      recommendations: response.choices[0].message.content,
      model: 'gpt-4',
      category,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating product recommendations:', error);
    throw new Error(`Failed to generate product recommendations: ${error.message}`);
  }
}

/**
 * Generate personalized workout programs
 * @param {Object} userProfile - User fitness profile and preferences
 * @returns {Promise<Object>} Customized workout program
 */
async function generateWorkoutProgram(userProfile) {
  try {
    const prompt = `Create a personalized 12-week workout program for the following user:

User Profile:
- Fitness Level: ${userProfile.fitnessLevel}
- Age: ${userProfile.age}
- Goals: ${userProfile.goals.join(', ')}
- Available Equipment: ${userProfile.availableEquipment?.join(', ') || 'Bodyweight only'}
- Workout Frequency: ${userProfile.workoutFrequency} days per week
- Session Duration: ${userProfile.sessionDuration} minutes
- Injuries/Limitations: ${userProfile.limitations || 'None'}
- Preferred Exercise Style: ${userProfile.exerciseStyle}

Please provide:
1. Program overview and objectives
2. Weekly schedule and split type
3. Detailed exercises for each workout day with sets, reps, and rest periods
4. Progressive overload strategy
5. Warm-up and cool-down routines
6. Recovery recommendations
7. Nutrition considerations for the program
8. Key milestones and progress tracking metrics`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an elite certified fitness coach with expertise in program design, periodization, and personalized training systems. Create comprehensive, safe, and effective workout programs.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    return {
      success: true,
      program: response.choices[0].message.content,
      model: 'gpt-4',
      duration: '12 weeks',
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating workout program:', error);
    throw new Error(`Failed to generate workout program: ${error.message}`);
  }
}

/**
 * Generate customized nutrition plans
 * @param {Object} userProfile - User health and dietary profile
 * @returns {Promise<Object>} Personalized nutrition plan
 */
async function generateNutritionPlan(userProfile) {
  try {
    const prompt = `Create a personalized 4-week nutrition plan for the following user:

User Profile:
- Age: ${userProfile.age}
- Weight: ${userProfile.weight} lbs
- Height: ${userProfile.height} inches
- Fitness Goals: ${userProfile.goals.join(', ')}
- Current Activity Level: ${userProfile.activityLevel}
- Dietary Restrictions: ${userProfile.dietaryRestrictions?.join(', ') || 'None'}
- Food Allergies: ${userProfile.allergies?.join(', ') || 'None'}
- Preferred Cuisine: ${userProfile.preferredCuisine?.join(', ') || 'Varied'}
- Budget Consideration: ${userProfile.budgetLevel}
- Cooking Skill Level: ${userProfile.cookingLevel}
- Medical Conditions: ${userProfile.medicalConditions?.join(', ') || 'None'}

Please provide:
1. Caloric and macronutrient targets (protein, carbs, fats)
2. Daily meal plan with recipes (breakfast, lunch, dinner, snacks)
3. Pre- and post-workout nutrition recommendations
4. Hydration guidelines
5. Supplement recommendations (if applicable)
6. Weekly grocery shopping list with estimated costs
7. Meal prep strategies and tips
8. Progress tracking metrics
9. Flexibility and alternatives for recipes`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a certified nutritionist and dietitian with expertise in sports nutrition, meal planning, and personalized dietary programs. Provide practical, evidence-based nutrition guidance.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    return {
      success: true,
      nutritionPlan: response.choices[0].message.content,
      model: 'gpt-4',
      duration: '4 weeks',
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating nutrition plan:', error);
    throw new Error(`Failed to generate nutrition plan: ${error.message}`);
  }
}

/**
 * Generate tactical gear suggestions
 * @param {Object} userProfile - User tactical requirements and preferences
 * @returns {Promise<Object>} Tactical gear recommendations
 */
async function generateTacticalGearSuggestions(userProfile) {
  try {
    const prompt = `Provide comprehensive tactical gear recommendations for the following user:

User Profile:
- Tactical Discipline: ${userProfile.discipline}
- Experience Level: ${userProfile.experienceLevel}
- Primary Use Case: ${userProfile.useCase}
- Environment/Terrain: ${userProfile.environment?.join(', ')}
- Weather Conditions: ${userProfile.weatherConditions?.join(', ')}
- Budget: $${userProfile.budget}
- Body Type: ${userProfile.bodyType}
- Specific Requirements: ${userProfile.requirements?.join(', ') || 'Standard'}

Please provide:
1. Essential gear recommendations with brands and models
2. Load bearing equipment (vest, rig, belt configurations)
3. Protective gear (helmet, body armor, eye protection)
4. Tactical clothing (boots, pants, shirts)
5. Hydration and nutrition carrying solutions
6. Communication and lighting equipment
7. First aid and survival kit recommendations
8. Maintenance and care tips for gear
9. Budget breakdown and cost optimization strategies
10. Durability ratings and real-world performance feedback
11. Modularity and upgrade options
12. Vendor recommendations and where to purchase`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an experienced tactical equipment specialist with deep knowledge of military, law enforcement, and civilian tactical gear. Provide expert recommendations based on real-world performance, durability, and practical application.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return {
      success: true,
      gearSuggestions: response.choices[0].message.content,
      model: 'gpt-4',
      discipline: userProfile.discipline,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating tactical gear suggestions:', error);
    throw new Error(`Failed to generate tactical gear suggestions: ${error.message}`);
  }
}

/**
 * Generate hybrid recommendations combining multiple aspects
 * @param {Object} userProfile - Comprehensive user profile
 * @returns {Promise<Object>} Combined recommendations
 */
async function generateHybridRecommendations(userProfile) {
  try {
    const prompt = `Create a comprehensive fitness and tactical lifestyle plan for the following user:

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Fitness Level: ${userProfile.fitnessLevel}
- Tactical Focus: ${userProfile.tacticalFocus}
- Goals: ${userProfile.goals.join(', ')}
- Available Time: ${userProfile.availableHours} hours per week
- Budget: $${userProfile.budget}

Please integrate and provide:
1. Synergistic workout and nutrition strategy
2. Tactical gear that complements training style
3. Recovery and injury prevention protocols
4. Mental resilience and performance optimization
5. 90-day progression roadmap
6. KPIs and success metrics`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a holistic performance coach combining expertise in fitness training, nutrition, tactical equipment, and athlete optimization.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2500,
    });

    return {
      success: true,
      hybridPlan: response.choices[0].message.content,
      model: 'gpt-4',
      duration: '90 days',
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating hybrid recommendations:', error);
    throw new Error(`Failed to generate hybrid recommendations: ${error.message}`);
  }
}

/**
 * Validate OpenAI API connectivity
 * @returns {Promise<Object>} API status
 */
async function validateConnection() {
  try {
    const response = await openai.models.list();
    return {
      success: true,
      message: 'OpenAI API connection established',
      availableModels: response.data.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error validating OpenAI connection:', error);
    throw new Error(`OpenAI API connection failed: ${error.message}`);
  }
}

// Export all functions
module.exports = {
  generateProductRecommendations,
  generateWorkoutProgram,
  generateNutritionPlan,
  generateTacticalGearSuggestions,
  generateHybridRecommendations,
  validateConnection,
  openai, // Export the OpenAI client for direct use if needed
};
