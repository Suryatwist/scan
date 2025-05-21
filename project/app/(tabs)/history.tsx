import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Calendar, ChevronDown } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { getRecentMeals } from '@/services/foodHistoryService';
import { Food } from '@/types/food';
import FoodHistoryItem from '@/components/history/FoodHistoryItem';
import DailyNutritionSummary from '@/components/history/DailyNutritionSummary';

export default function HistoryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [meals, setMeals] = useState<Food[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadMeals();
    }, [selectedDate])
  );

  const loadMeals = async () => {
    setLoading(true);
    try {
      const data = await getRecentMeals(selectedDate);
      setMeals(data);
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  };

  const navigateToFoodDetails = (foodId: string) => {
    router.push({
      pathname: '/food-details',
      params: { foodId }
    });
  };

  // Group meals by time of day
  const mealsByTime = meals.reduce((acc, meal) => {
    const hour = new Date(meal.timestamp).getHours();
    let timeOfDay = 'Other';
    
    if (hour >= 5 && hour < 11) timeOfDay = 'Breakfast';
    else if (hour >= 11 && hour < 16) timeOfDay = 'Lunch';
    else if (hour >= 16 && hour < 21) timeOfDay = 'Dinner';
    else if (hour >= 21 || hour < 5) timeOfDay = 'Snacks';
    
    if (!acc[timeOfDay]) acc[timeOfDay] = [];
    acc[timeOfDay].push(meal);
    return acc;
  }, {} as Record<string, Food[]>);

  const timeCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Other'];
  
  const renderTimeCategory = ({ item: category }: { item: string }) => {
    const categoryMeals = mealsByTime[category];
    if (!categoryMeals || categoryMeals.length === 0) return null;
    
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{category}</Text>
        {categoryMeals.map(meal => (
          <FoodHistoryItem 
            key={meal.id} 
            food={meal} 
            onPress={() => navigateToFoodDetails(meal.id)} 
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <TouchableOpacity 
          style={styles.dateSelectorButton} 
          onPress={() => setShowDatePicker(!showDatePicker)}
        >
          <Calendar size={20} color={Colors.primary} />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </Text>
          <ChevronDown size={20} color={Colors.primary} />
        </TouchableOpacity>
        
        {/* Date picker would go here */}
        {showDatePicker && (
          <View style={styles.datePickerContainer}>
            {/* Simplified date picker - in a real app use a real date picker component */}
            <TouchableOpacity 
              style={styles.dateOption} 
              onPress={() => handleDateChange(new Date())}
            >
              <Text style={styles.dateOptionText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.dateOption} 
              onPress={() => {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                handleDateChange(yesterday);
              }}
            >
              <Text style={styles.dateOptionText}>Yesterday</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Daily Summary */}
      <DailyNutritionSummary meals={meals} date={selectedDate} />
      
      {/* Meal History List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading meals...</Text>
        </View>
      ) : meals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No meals recorded for this date</Text>
          <TouchableOpacity 
            style={styles.addMealButton}
            onPress={() => router.push('/scan')}
          >
            <Text style={styles.addMealButtonText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={timeCategories}
          renderItem={renderTimeCategory}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  dateSelector: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    zIndex: 100,
  },
  dateSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.primary,
    marginHorizontal: 8,
  },
  datePickerContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    zIndex: 101,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  dateOptionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.primary,
  },
  listContainer: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 20,
  },
  addMealButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addMealButtonText: {
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    fontSize: 16,
  },
});