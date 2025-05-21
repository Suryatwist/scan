import axios from 'axios';

// Set up Spoonacular API
export const spoonacularApi = axios.create({
  baseURL: 'https://api.spoonacular.com',
  params: {
    apiKey: '7cfb3f2a9b964ae695abc5e55576c0ee', // Spoonacular API key
  },
});

// Set up Nutritionix API
export const nutritionixApi = axios.create({
  baseURL: 'https://trackapi.nutritionix.com/v2',
  headers: {
    'x-app-id': '49c83e49',
    'x-app-key': 'a4b6944f626c26f2d45f81497c66e401',
  },
});

// Set up Edamam API
export const edamamApi = axios.create({
  baseURL: 'https://api.edamam.com',
  params: {
    app_id: 'YOUR_EDAMAM_APP_ID', // Replace with actual ID
    app_key: 'eaf392efa9mshc304d9dc53992edp12f63ajsndb84d6b5a376',
  },
});

// Mock food recognition API
export const foodRecognitionApi = {
  recognizeFood: async (imageBase64: string) => {
    // In a real app, this would call an AI-powered food recognition API
    // For demo purposes, we'll simulate a response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock response
    return {
      data: {
        food: {
          name: 'Grilled Chicken Salad',
          confidence: 0.85,
          calories: 320,
          carbs: 12,
          protein: 38,
          fat: 14,
          fiber: 6,
        }
      }
    };
  }
};