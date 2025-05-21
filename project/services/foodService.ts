import { Food } from '@/types/food';
import { foodRecognitionApi } from './apiService';
import * as SecureStore from 'expo-secure-store';

// Mock database of foods for demo purposes
const mockFoods: Record<string, Food> = {
  '1': {
    id: '1',
    name: 'Grilled Chicken Salad',
    type: 'protein',
    imageUrl: 'https://images.pexels.com/photos/5718073/pexels-photo-5718073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    weight: 350,
    timestamp: new Date().toISOString(),
    nutrition: {
      calories: 320,
      carbs: 12,
      protein: 38,
      fat: 14,
      fiber: 6,
      sugar: 4,
      sodium: 520,
    },
  },
  '2': {
    id: '2',
    name: 'Chocolate Brownie',
    type: 'dessert',
    imageUrl: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    weight: 85,
    timestamp: new Date().toISOString(),
    nutrition: {
      calories: 380,
      carbs: 45,
      protein: 4,
      fat: 22,
      fiber: 2,
      sugar: 32,
      sodium: 190,
    },
  },
  '3': {
    id: '3',
    name: 'Vegetable Stir Fry',
    type: 'vegetable',
    imageUrl: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    weight: 280,
    timestamp: new Date().toISOString(),
    nutrition: {
      calories: 220,
      carbs: 28,
      protein: 8,
      fat: 8,
      fiber: 7,
      sugar: 10,
      sodium: 340,
    },
  },
  '4': {
    id: '4',
    name: 'Banana',
    type: 'fruit',
    imageUrl: 'https://images.pexels.com/photos/2116020/pexels-photo-2116020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    weight: 120,
    timestamp: new Date().toISOString(),
    nutrition: {
      calories: 105,
      carbs: 27,
      protein: 1.3,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14,
      sodium: 1,
    },
  },
  '5': {
    id: '5',
    name: 'Salmon Fillet',
    type: 'protein',
    imageUrl: 'https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    weight: 180,
    timestamp: new Date().toISOString(),
    nutrition: {
      calories: 412,
      carbs: 0,
      protein: 40,
      fat: 27,
      fiber: 0,
      sodium: 140,
      cholesterol: 109,
    },
  },
  'b1': {
    id: 'b1',
    name: 'Coca-Cola',
    type: 'beverage',
    imageUrl: 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    weight: 355, // ml
    timestamp: new Date().toISOString(),
    nutrition: {
      calories: 140,
      carbs: 39,
      protein: 0,
      fat: 0,
      fiber: 0,
      sugar: 39,
      sodium: 45,
    },
  },
  'b2': {
    id: 'b2',
    name: 'Lay\'s Classic Potato Chips',
    type: 'snack',
    imageUrl: 'https://images.pexels.com/photos/2819058/pexels-photo-2819058.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    weight: 28, // single serving bag
    timestamp: new Date().toISOString(),
    nutrition: {
      calories: 160,
      carbs: 15,
      protein: 2,
      fat: 10,
      fiber: 1,
      sugar: 1,
      sodium: 170,
    },
  },
};

export const getFoodById = async (id: string): Promise<Food> => {
  // For demo purposes, we'll use our mock database
  if (id in mockFoods) {
    return mockFoods[id];
  }
  
  // If food not found in mocks, throw error
  throw new Error(`Food with ID ${id} not found`);
};

export const searchFoods = async (query: string): Promise<Food[]> => {
  // In a real app, this would query an API
  
  // For demo purposes, we'll filter our mock foods
  const results = Object.values(mockFoods).filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return results;
};

export const getNutritionInfo = async (foodName: string, weight: number): Promise<Food['nutrition']> => {
  // In a real app, this would query a nutrition API like Spoonacular or Nutritionix
  
  // For demo purposes, generate some plausible nutrition data
  return {
    calories: Math.round(weight * 2),
    carbs: Math.round(weight * 0.3),
    protein: Math.round(weight * 0.2),
    fat: Math.round(weight * 0.1),
    fiber: Math.round(weight * 0.03),
    sugar: Math.round(weight * 0.1),
    sodium: Math.round(weight * 2),
  };
};