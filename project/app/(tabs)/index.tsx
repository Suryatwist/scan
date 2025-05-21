import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '@/context/UserContext';
import Colors from '@/constants/Colors';
import DailyNutritionProgress from '@/components/home/DailyNutritionProgress';
import RecommendationCard from '@/components/home/RecommendationCard';
import { getTodaysMeals } from '@/services/foodHistoryService';
import { Food } from '@/types/food';
import TodaysMeals from '@/components/home/TodaysMeals';
import { ChevronRight, Utensils } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useUser();
  const [todaysMeals, setTodaysMeals] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const meals = await getTodaysMeals();
        setTodaysMeals(meals);
      } catch (error) {
        console.error('Error loading today\'s meals:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Calculate total nutrition values
  const totalNutrition = todaysMeals.reduce(
    (acc, meal) => {
      return {
        calories: acc.calories + meal.nutrition.calories,
        carbs: acc.carbs + meal.nutrition.carbs,
        protein: acc.protein + meal.nutrition.protein,
        fat: acc.fat + meal.nutrition.fat,
        fiber: acc.fiber + meal.nutrition.fiber,
      };
    },
    { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 }
  );

  // User's daily target (would normally come from user profile)
  const dailyTarget = {
    calories: user?.dailyTarget?.calories || 2000,
    carbs: user?.dailyTarget?.carbs || 250,  // grams
    protein: user?.dailyTarget?.protein || 150, // grams
    fat: user?.dailyTarget?.fat || 65,  // grams
    fiber: user?.dailyTarget?.fiber || 25, // grams
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Hello, <Text style={styles.nameText}>{user?.name || 'there'}</Text>!
        </Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Daily Progress */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Nutrition</Text>
          <TouchableOpacity onPress={() => router.push('/history')}>
            <ChevronRight size={20} color={Colors.gray[600]} />
          </TouchableOpacity>
        </View>
        <DailyNutritionProgress 
          current={totalNutrition} 
          target={dailyTarget} 
        />
      </View>
      
      {/* Today's Meals */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <TouchableOpacity onPress={() => router.push('/scan')}>
            <View style={styles.addMealButton}>
              <Utensils size={16} color={Colors.white} />
              <Text style={styles.addMealText}>Add Meal</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <TodaysMeals meals={todaysMeals} loading={loading} />
      </View>
      
      {/* Recommendations */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendationsContainer}>
          <RecommendationCard 
            title="High Protein Breakfast"
            description="Boost your mornings with extra protein"
            image="https://images.pexels.com/photos/4144234/pexels-photo-4144234.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            reason="Based on your fitness goal"
          />
          <RecommendationCard 
            title="Low Sugar Snacks"
            description="Great alternatives to keep energy levels steady"
            image="https://images.pexels.com/photos/8474343/pexels-photo-8474343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            reason="Based on your health profile"
          />
          <RecommendationCard 
            title="Fiber-Rich Dinner"
            description="End your day with digestive health in mind"
            image="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            reason="Health optimization"
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  welcomeSection: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[600],
  },
  nameText: {
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: Colors.primary,
  },
  recommendationsContainer: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addMealText: {
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
});