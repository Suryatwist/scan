import { Food } from '@/types/food';

// Mock barcode database
const barcodeDatabase: Record<string, Food> = {
  // UPC codes for common food items
  '049000042566': { // Coca-Cola
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
  '038000138416': { // Lays Potato Chips
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
  '021130126026': { // Cheerios
    id: 'b3',
    name: 'Cheerios',
    type: 'cereal',
    imageUrl: 'https://images.pexels.com/photos/135525/pexels-photo-135525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    weight: 28, // single serving
    timestamp: new Date().toISOString(),
    nutrition: {
      calories: 100,
      carbs: 20,
      protein: 3,
      fat: 2,
      fiber: 3,
      sugar: 1,
      sodium: 140,
    },
  },
  // Add more barcode entries as needed
};

export const getBarcodeFood = async (barcode: string): Promise<Food | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real app, we would connect to a barcode database API
  // For demo purposes, we'll use our mock database
  
  // If barcode is in our database, return the food
  if (barcode in barcodeDatabase) {
    const food = { ...barcodeDatabase[barcode] };
    food.timestamp = new Date().toISOString();
    return food;
  }
  
  // For demo purposes, if barcode not found, return a random item
  const barcodes = Object.keys(barcodeDatabase);
  const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)];
  const randomFood = { ...barcodeDatabase[randomBarcode] };
  randomFood.timestamp = new Date().toISOString();
  
  return randomFood;
};