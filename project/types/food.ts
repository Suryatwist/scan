export interface Food {
  id: string;
  name: string;
  type: string; // e.g., fruit, vegetable, meat, dessert, etc.
  imageUrl: string;
  weight: number; // in grams
  timestamp: string; // ISO date string
  nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar?: number;
    sodium?: number;
    cholesterol?: number;
    saturatedFat?: number;
  };
}