import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface Nutrition {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  saturatedFat?: number;
  transFat?: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
}

interface Props {
  nutrition: Nutrition;
}

export default function NutritionLabel({ nutrition }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Nutrition Facts</Text>
        <Text style={styles.servingSize}>Per Serving</Text>
      </View>
      
      <View style={styles.calorieSection}>
        <Text style={styles.calorieTitle}>Calories</Text>
        <Text style={styles.calorieValue}>{nutrition.calories}</Text>
      </View>
      
      <View style={styles.divider} />
      <Text style={styles.dailyValueHeader}>% Daily Value*</Text>
      
      <NutrientRow 
        name="Total Fat" 
        value={`${nutrition.fat}g`} 
        percentage={Math.round((nutrition.fat / 65) * 100)} 
      />
      
      {nutrition.saturatedFat !== undefined && (
        <NutrientRow 
          name="Saturated Fat" 
          value={`${nutrition.saturatedFat}g`} 
          percentage={Math.round((nutrition.saturatedFat / 20) * 100)}
          indented
        />
      )}
      
      {nutrition.transFat !== undefined && (
        <NutrientRow 
          name="Trans Fat" 
          value={`${nutrition.transFat}g`}
          indented
        />
      )}
      
      {nutrition.cholesterol !== undefined && (
        <NutrientRow 
          name="Cholesterol" 
          value={`${nutrition.cholesterol}mg`} 
          percentage={Math.round((nutrition.cholesterol / 300) * 100)}
        />
      )}
      
      {nutrition.sodium !== undefined && (
        <NutrientRow 
          name="Sodium" 
          value={`${nutrition.sodium}mg`} 
          percentage={Math.round((nutrition.sodium / 2300) * 100)}
        />
      )}
      
      <NutrientRow 
        name="Total Carbohydrate" 
        value={`${nutrition.carbs}g`} 
        percentage={Math.round((nutrition.carbs / 300) * 100)}
      />
      
      <NutrientRow 
        name="Dietary Fiber" 
        value={`${nutrition.fiber}g`} 
        percentage={Math.round((nutrition.fiber / 25) * 100)}
        indented
      />
      
      {nutrition.sugar !== undefined && (
        <NutrientRow 
          name="Total Sugars" 
          value={`${nutrition.sugar}g`}
          indented
        />
      )}
      
      <NutrientRow 
        name="Protein" 
        value={`${nutrition.protein}g`} 
        percentage={Math.round((nutrition.protein / 50) * 100)}
      />
      
      <View style={styles.divider} />
      
      {nutrition.vitaminA !== undefined && (
        <NutrientRow 
          name="Vitamin A" 
          percentage={nutrition.vitaminA}
        />
      )}
      
      {nutrition.vitaminC !== undefined && (
        <NutrientRow 
          name="Vitamin C" 
          percentage={nutrition.vitaminC}
        />
      )}
      
      {nutrition.calcium !== undefined && (
        <NutrientRow 
          name="Calcium" 
          percentage={nutrition.calcium}
        />
      )}
      
      {nutrition.iron !== undefined && (
        <NutrientRow 
          name="Iron" 
          percentage={nutrition.iron}
        />
      )}
      
      <Text style={styles.footerText}>
        * Percent Daily Values are based on a 2,000 calorie diet.
      </Text>
    </View>
  );
}

interface NutrientRowProps {
  name: string;
  value?: string;
  percentage?: number;
  indented?: boolean;
}

function NutrientRow({ name, value, percentage, indented = false }: NutrientRowProps) {
  return (
    <View style={[styles.nutrientRow, indented && styles.indentedRow]}>
      <Text style={styles.nutrientName}>{name}</Text>
      <View style={styles.nutrientValueContainer}>
        {value && <Text style={styles.nutrientValue}>{value}</Text>}
        {percentage !== undefined && <Text style={styles.nutrientPercentage}>{percentage}%</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    padding: 12,
  },
  headerSection: {
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: Colors.primary,
  },
  servingSize: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
  },
  calorieSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  calorieTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.primary,
  },
  calorieValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[300],
    marginVertical: 8,
  },
  dailyValueHeader: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
    textAlign: 'right',
    marginBottom: 4,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  indentedRow: {
    paddingLeft: 16,
  },
  nutrientName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[800],
  },
  nutrientValueContainer: {
    flexDirection: 'row',
  },
  nutrientValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[800],
    marginRight: 8,
  },
  nutrientPercentage: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.gray[800],
    minWidth: 35,
    textAlign: 'right',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.gray[600],
    marginTop: 12,
  },
});