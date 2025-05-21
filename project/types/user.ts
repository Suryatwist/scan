export type MedicalCondition = 'Diabetes' | 'Hypertension' | 'High Cholesterol' | 'Thyroid Issues' | 'PCOS';

export type FitnessGoal = 'Weight Maintenance' | 'Fat Loss' | 'Muscle Gain';

export interface User {
  id?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  weight: number; // in kg
  height: number; // in cm
  bmi: string;
  fitnessGoal: FitnessGoal;
  medicalConditions: MedicalCondition[];
  allergies: string[];
  dietaryPreferences: string[];
  dailyTarget: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
  };
}