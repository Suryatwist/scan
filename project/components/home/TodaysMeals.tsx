import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Food } from '@/types/food';

interface Props {
  meals: Food[];
  loading: boolean;
}

export default function TodaysMeals({ meals, loading }: Props) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} />
        <Text style={styles.loadingText}>Loading meals...</Text>
      </View>
    );
  }

  if (meals.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No meals recorded today</Text>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => router.push('/scan')}
        >
          <Text style={styles.scanButtonText}>Scan Food</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {meals.slice(0, 3).map((meal, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.mealItem}
          onPress={() => router.push({
            pathname: '/food-details',
            params: { foodId: meal.id }
          })}
        >
          <Image source={{ uri: meal.imageUrl }} style={styles.mealImage} />
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealDetail}>
              {meal.weight}g • {meal.nutrition.calories} kcal
            </Text>
            <View style={styles.macroRow}>
              <Text style={styles.macroText}>C: {meal.nutrition.carbs}g</Text>
              <Text style={styles.macroText}>P: {meal.nutrition.protein}g</Text>
              <Text style={styles.macroText}>F: {meal.nutrition.fat}g</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.gray[400]} />
        </TouchableOpacity>
      ))}
      
      {meals.length > 3 && (
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/history')}
        >
          <Text style={styles.viewAllText}>View All Meals</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
  },
  scanButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.white,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.gray[300],
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.primary,
  },
  mealDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
    marginVertical: 2,
  },
  macroRow: {
    flexDirection: 'row',
  },
  macroText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[700],
    marginRight: 8,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  viewAllText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.primary,
  },
});