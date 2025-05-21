import { Food } from '@/types/food';

// Mock food recognition service
// In a real app, this would connect to a machine learning API

// Mock database of foods
const foodDatabase: Food[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
  }
];

export const analyzeFood = async (imageUri: string): Promise<Food> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, we would send the image to a food recognition API
  // and receive detailed information about the food
  
  // For demo purposes, we'll return a random food from our database
  const randomIndex = Math.floor(Math.random() * foodDatabase.length);
  const recognizedFood = { ...foodDatabase[randomIndex] };
  
  // Update timestamp to current time
  recognizedFood.timestamp = new Date().toISOString();
  
  return recognizedFood;
};

// Function to estimate food weight based on visual cues
// In a real app, this would use depth sensing or reference objects
export const estimateFoodWeight = async (imageUri: string, foodType: string): Promise<number> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock weight estimation based on food type
  const weightRanges: Record<string, [number, number]> = {
    fruit: [80, 200],
    vegetable: [150, 300],
    protein: [120, 250],
    dessert: [60, 150],
    default: [100, 300],
  };
  
  const [min, max] = weightRanges[foodType] || weightRanges.default;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};