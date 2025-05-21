import { Food } from '@/types/food';
import { User, MedicalCondition } from '@/types/user';

// Mock database of alternative foods for recommendations
const alternativeFoods: Record<string, Food[]> = {
  'dessert': [
    {
      id: 'alt1',
      name: 'Greek Yogurt with Berries',
      type: 'dessert',
      imageUrl: 'https://images.pexels.com/photos/1435288/pexels-photo-1435288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      weight: 150,
      timestamp: new Date().toISOString(),
      nutrition: {
        calories: 120,
        carbs: 15,
        protein: 15,
        fat: 0,
        fiber: 3,
        sugar: 10,
      },
    },
    {
      id: 'alt2',
      name: 'Apple Slices with Almond Butter',
      type: 'dessert',
      imageUrl: 'https://images.pexels.com/photos/4879393/pexels-photo-4879393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      weight: 100,
      timestamp: new Date().toISOString(),
      nutrition: {
        calories: 150,
        carbs: 20,
        protein: 4,
        fat: 8,
        fiber: 4,
        sugar: 14,
      },
    },
  ],
  'beverage': [
    {
      id: 'alt3',
      name: 'Green Tea',
      type: 'beverage',
      imageUrl: 'https://images.pexels.com/photos/39347/tea-green-tea-chinese-tea-green-39347.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      weight: 240,
      timestamp: new Date().toISOString(),
      nutrition: {
        calories: 2,
        carbs: 0,
        protein: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
      },
    },
    {
      id: 'alt4',
      name: 'Sparkling Water with Lemon',
      type: 'beverage',
      imageUrl: 'https://images.pexels.com/photos/5947021/pexels-photo-5947021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      weight: 355,
      timestamp: new Date().toISOString(),
      nutrition: {
        calories: 5,
        carbs: 1,
        protein: 0,
        fat: 0,
        fiber: 0,
        sugar: 1,
      },
    },
  ],
  'snack': [
    {
      id: 'alt5',
      name: 'Mixed Nuts',
      type: 'snack',
      imageUrl: 'https://images.pexels.com/photos/5942598/pexels-photo-5942598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      weight: 30,
      timestamp: new Date().toISOString(),
      nutrition: {
        calories: 180,
        carbs: 6,
        protein: 6,
        fat: 16,
        fiber: 3,
        sugar: 1,
      },
    },
    {
      id: 'alt6',
      name: 'Vegetable Sticks with Hummus',
      type: 'snack',
      imageUrl: 'https://images.pexels.com/photos/5852331/pexels-photo-5852331.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      weight: 100,
      timestamp: new Date().toISOString(),
      nutrition: {
        calories: 130,
        carbs: 15,
        protein: 5,
        fat: 6,
        fiber: 5,
        sugar: 5,
      },
    },
  ],
};

export const generateRecommendations = async (food: Food, user: User): Promise<string[]> => {
  const recommendations: string[] = [];
  
  // Generate recommendations based on user's medical conditions and food type
  if (user.medicalConditions.includes('Diabetes')) {
    // Recommendations for diabetic users
    if (food.nutrition.sugar && food.nutrition.sugar > 15) {
      recommendations.push('This food has high sugar content. Consider alternatives with less sugar for better blood glucose control.');
    }
    
    if (food.nutrition.carbs > 30) {
      recommendations.push('This meal is high in carbohydrates. Try to balance it with protein and fiber to slow glucose absorption.');
    }
  }
  
  if (user.medicalConditions.includes('Hypertension')) {
    // Recommendations for users with hypertension
    if (food.nutrition.sodium && food.nutrition.sodium > 400) {
      recommendations.push('This food is high in sodium. Consider low-sodium alternatives to help manage blood pressure.');
    }
  }
  
  // Fitness goal based recommendations
  if (user.fitnessGoal === 'Fat Loss') {
    if (food.nutrition.calories > 300) {
      recommendations.push('This food is relatively high in calories. Consider smaller portions to support your fat loss goal.');
    }
    
    if (food.nutrition.fat > 15) {
      recommendations.push('This food is high in fat. Try choosing leaner options to support your fat loss journey.');
    }
  }
  
  if (user.fitnessGoal === 'Muscle Gain') {
    if (food.nutrition.protein < 15) {
      recommendations.push('This food is low in protein. Consider adding a protein source to support muscle growth.');
    }
  }
  
  // General health recommendations
  if (food.nutrition.fiber < 3) {
    recommendations.push('This meal is low in fiber. Consider adding vegetables or whole grains to increase fiber intake.');
  }
  
  // Check against allergies
  user.allergies.forEach(allergy => {
    if (food.name.toLowerCase().includes(allergy.toLowerCase())) {
      recommendations.push(`CAUTION: This food may contain ${allergy}, which you've listed as an allergy.`);
    }
  });
  
  // If no specific recommendations, add a general one
  if (recommendations.length === 0) {
    recommendations.push('This food appears to align well with your health profile and fitness goals.');
  }
  
  return recommendations;
};

interface FoodSuggestion {
  id: string;
  name: string;
  imageUrl: string;
  reason: string;
}

export const getAlternativeRecommendations = async (
  foodId: string, 
  foodType: string, 
  healthProfile: MedicalCondition[]
): Promise<FoodSuggestion[]> => {
  // Get alternative foods based on food type
  const alternatives = alternativeFoods[foodType] || [];
  
  // If no alternatives available, return empty array
  if (alternatives.length === 0) {
    return [];
  }
  
  // Generate personalized recommendations
  const suggestions: FoodSuggestion[] = [];
  
  for (const alt of alternatives) {
    let reason = '';
    
    // Generate reason based on health profile
    if (healthProfile.includes('Diabetes') && alt.nutrition.sugar !== undefined && alt.nutrition.sugar < 10) {
      reason = 'Lower in sugar, better for blood glucose control';
    } else if (healthProfile.includes('Hypertension') && alt.nutrition.sodium !== undefined && alt.nutrition.sodium < 200) {
      reason = 'Lower in sodium, better for blood pressure management';
    } else if (alt.nutrition.calories < 150) {
      reason = 'Lower calorie alternative';
    } else if (alt.nutrition.fiber > 3) {
      reason = 'Higher in fiber for better digestive health';
    } else if (alt.nutrition.protein > 10) {
      reason = 'Good source of protein';
    } else {
      reason = 'Healthier alternative option';
    }
    
    suggestions.push({
      id: alt.id,
      name: alt.name,
      imageUrl: alt.imageUrl,
      reason,
    });
  }
  
  return suggestions;
};