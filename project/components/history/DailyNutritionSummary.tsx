import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Food } from '@/types/food';

interface Props {
  meals: Food[];
  date: Date;
}

export default function DailyNutritionSummary({ meals, date }: Props) {
  // Calculate total nutrition
  const totalNutrition = meals.reduce(
    (acc, meal) => {
      return {
        calories: acc.calories + meal.nutrition.calories,
        carbs: acc.carbs + meal.nutrition.carbs,
        protein: acc.protein + meal.nutrition.protein,
        fat: acc.fat + meal.nutrition.fat,
      };
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0 }
  );

  // Calculate macro percentages
  const totalCaloriesFromMacros = 
    totalNutrition.carbs * 4 +     // 4 calories per gram of carbs
    totalNutrition.protein * 4 +   // 4 calories per gram of protein
    totalNutrition.fat * 9;        // 9 calories per gram of fat
  
  const carbPercent = totalCaloriesFromMacros > 0 
    ? Math.round((totalNutrition.carbs * 4 / totalCaloriesFromMacros) * 100) 
    : 0;
  
  const proteinPercent = totalCaloriesFromMacros > 0 
    ? Math.round((totalNutrition.protein * 4 / totalCaloriesFromMacros) * 100) 
    : 0;
  
  const fatPercent = totalCaloriesFromMacros > 0 
    ? Math.round((totalNutrition.fat * 9 / totalCaloriesFromMacros) * 100) 
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.nutritionContainer}>
        <View style={styles.calorieContainer}>
          <Text style={styles.calorieValue}>{totalNutrition.calories}</Text>
          <Text style={styles.calorieLabel}>Total Calories</Text>
        </View>
        
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <View style={styles.macroLabelContainer}>
              <View style={[styles.macroColorIndicator, { backgroundColor: Colors.nutrition.carbs }]} />
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <Text style={styles.macroValue}>{totalNutrition.carbs}g</Text>
            <Text style={styles.macroPercent}>{carbPercent}%</Text>
          </View>
          
          <View style={styles.macroItem}>
            <View style={styles.macroLabelContainer}>
              <View style={[styles.macroColorIndicator, { backgroundColor: Colors.nutrition.protein }]} />
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <Text style={styles.macroValue}>{totalNutrition.protein}g</Text>
            <Text style={styles.macroPercent}>{proteinPercent}%</Text>
          </View>
          
          <View style={styles.macroItem}>
            <View style={styles.macroLabelContainer}>
              <View style={[styles.macroColorIndicator, { backgroundColor: Colors.nutrition.fat }]} />
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
            <Text style={styles.macroValue}>{totalNutrition.fat}g</Text>
            <Text style={styles.macroPercent}>{fatPercent}%</Text>
          </View>
        </View>
      </View>
      
      {/* Macro proportion bar */}
      <View style={styles.macroBarContainer}>
        <View 
          style={[
            styles.macroBarSegment, 
            { backgroundColor: Colors.nutrition.carbs, flex: carbPercent || 1 }
          ]} 
        />
        <View 
          style={[
            styles.macroBarSegment, 
            { backgroundColor: Colors.nutrition.protein, flex: proteinPercent || 1 }
          ]} 
        />
        <View 
          style={[
            styles.macroBarSegment, 
            { backgroundColor: Colors.nutrition.fat, flex: fatPercent || 1 }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  nutritionContainer: {
    flexDirection: 'row',
  },
  calorieContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
    minWidth: 100,
  },
  calorieValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.primary,
  },
  calorieLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
  },
  macrosContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  macroItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 65,
  },
  macroColorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  macroLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
  },
  macroValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.primary,
    width: 45,
    textAlign: 'right',
  },
  macroPercent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    width: 35,
    textAlign: 'right',
  },
  macroBarContainer: {
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 16,
  },
  macroBarSegment: {
    height: '100%',
  },
});