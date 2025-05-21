import { Food } from '@/types/food';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Store/retrieve meals from storage
const MEALS_STORAGE_KEY = 'meal_history';

// Platform-specific storage implementation
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
};

// Get all meals from storage
const getMeals = async (): Promise<Food[]> => {
  try {
    const mealsJson = await storage.getItem(MEALS_STORAGE_KEY);
    return mealsJson ? JSON.parse(mealsJson) : [];
  } catch (error) {
    console.error('Error getting meals from storage:', error);
    return [];
  }
};

// Save meals to storage
const saveMeals = async (meals: Food[]): Promise<void> => {
  try {
    await storage.setItem(MEALS_STORAGE_KEY, JSON.stringify(meals));
  } catch (error) {
    console.error('Error saving meals to storage:', error);
    throw error;
  }
};

// Add a new meal to history
export const saveMeal = async (food: Food): Promise<void> => {
  try {
    const meals = await getMeals();
    
    // Ensure the food has a timestamp
    const mealToSave = {
      ...food,
      timestamp: food.timestamp || new Date().toISOString(),
    };
    
    meals.push(mealToSave);
    await saveMeals(meals);
  } catch (error) {
    console.error('Error saving meal:', error);
    throw error;
  }
};

// Get meals for today
export const getTodaysMeals = async (): Promise<Food[]> => {
  try {
    const meals = await getMeals();
    
    // Filter to include only meals from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return meals.filter(meal => {
      const mealDate = new Date(meal.timestamp);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === today.getTime();
    });
  } catch (error) {
    console.error('Error getting today\'s meals:', error);
    return [];
  }
};

// Get meals for a specific date
export const getRecentMeals = async (date: Date): Promise<Food[]> => {
  try {
    const meals = await getMeals();
    
    // Filter to include only meals from the specified date
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return meals.filter(meal => {
      const mealDate = new Date(meal.timestamp);
      mealDate.setHours(0, 0, 0, 0);
      return mealDate.getTime() === targetDate.getTime();
    }).sort((a, b) => {
      // Sort by timestamp, newest first
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  } catch (error) {
    console.error('Error getting meals for date:', error);
    return [];
  }
};

// Delete a meal from history
export const deleteMeal = async (mealId: string): Promise<void> => {
  try {
    const meals = await getMeals();
    const updatedMeals = meals.filter(meal => meal.id !== mealId);
    await saveMeals(updatedMeals);
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};