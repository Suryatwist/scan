import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface NutritionValues {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
}

interface Props {
  current: NutritionValues;
  target: NutritionValues;
}

export default function DailyNutritionProgress({ current, target }: Props) {
  // Calculate percentages
  const calculatePercentage = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const percentages = {
    calories: calculatePercentage(current.calories, target.calories),
    carbs: calculatePercentage(current.carbs, target.carbs),
    protein: calculatePercentage(current.protein, target.protein),
    fat: calculatePercentage(current.fat, target.fat),
    fiber: calculatePercentage(current.fiber, target.fiber),
  };

  return (
    <View style={styles.container}>
      {/* Calories */}
      <View style={styles.nutritionItem}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Calories</Text>
          <Text style={styles.value}>
            {current.calories} / {target.calories} kcal
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${percentages.calories}%`, backgroundColor: Colors.accent }
            ]} 
          />
        </View>
      </View>

      {/* Macronutrients */}
      <View style={styles.nutritionItem}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Carbs</Text>
          <Text style={styles.value}>
            {current.carbs} / {target.carbs} g
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${percentages.carbs}%`, backgroundColor: Colors.nutrition.carbs }
            ]} 
          />
        </View>
      </View>

      <View style={styles.nutritionItem}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Protein</Text>
          <Text style={styles.value}>
            {current.protein} / {target.protein} g
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${percentages.protein}%`, backgroundColor: Colors.nutrition.protein }
            ]} 
          />
        </View>
      </View>

      <View style={styles.nutritionItem}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Fat</Text>
          <Text style={styles.value}>
            {current.fat} / {target.fat} g
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${percentages.fat}%`, backgroundColor: Colors.nutrition.fat }
            ]} 
          />
        </View>
      </View>

      <View style={styles.nutritionItem}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Fiber</Text>
          <Text style={styles.value}>
            {current.fiber} / {target.fiber} g
          </Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${percentages.fiber}%`, backgroundColor: Colors.nutrition.fiber }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  nutritionItem: {
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
  },
  value: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
});