import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Check, ChevronLeft, ExternalLink } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Food } from '@/types/food';
import NutritionLabel from '@/components/food/NutritionLabel';
import FoodRecommendations from '@/components/food/FoodRecommendations';
import { getFoodById } from '@/services/foodService';
import { saveMeal } from '@/services/foodHistoryService';
import { generateRecommendations } from '@/services/recommendationService';
import { useUser } from '@/context/UserContext';
import LoadingOverlay from '@/components/common/LoadingOverlay';

export default function FoodDetailsScreen() {
  const { foodId } = useLocalSearchParams();
  const { user } = useUser();
  const [food, setFood] = useState<Food | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadFoodDetails() {
      try {
        if (typeof foodId !== 'string') {
          throw new Error('Invalid food ID');
        }
        
        const foodData = await getFoodById(foodId);
        setFood(foodData);
        
        // Generate health recommendations based on user profile and food
        if (user) {
          const recs = await generateRecommendations(foodData, user);
          setRecommendations(recs);
        }
      } catch (error) {
        console.error('Error loading food details:', error);
        Alert.alert('Error', 'Failed to load food details.');
      } finally {
        setLoading(false);
      }
    }
    
    loadFoodDetails();
  }, [foodId, user]);

  const handleSaveMeal = async () => {
    if (!food) return;
    
    setSaving(true);
    try {
      await saveMeal(food);
      Alert.alert('Success', 'Meal saved to your history!');
      router.back();
    } catch (error) {
      console.error('Error saving meal:', error);
      Alert.alert('Error', 'Failed to save meal to history.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingOverlay message="Loading food details..." />;
  }

  if (!food) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Food not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          title: food.name,
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container}>
        {/* Food Image */}
        <Image 
          source={{ uri: food.imageUrl }} 
          style={styles.foodImage}
          resizeMode="cover"
        />
        
        {/* Food Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.servingInfo}>
            {food.weight}g • {food.nutrition.calories} calories per serving
          </Text>
          
          {/* Nutrition Summary */}
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{food.nutrition.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{food.nutrition.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{food.nutrition.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{food.nutrition.fiber}g</Text>
              <Text style={styles.macroLabel}>Fiber</Text>
            </View>
          </View>
          
          {/* Health Recommendations */}
          {recommendations.length > 0 && (
            <View style={styles.recommendationsContainer}>
              <Text style={styles.sectionTitle}>Health Recommendations</Text>
              {recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationIcon}>
                    <Check size={16} color={Colors.white} />
                  </View>
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          )}
          
          {/* Nutrition Label */}
          <View style={styles.nutritionContainer}>
            <Text style={styles.sectionTitle}>Nutrition Facts</Text>
            <NutritionLabel nutrition={food.nutrition} />
          </View>
          
          {/* Alternative Suggestions */}
          <FoodRecommendations 
            foodId={food.id} 
            foodType={food.type}
            healthProfile={user?.medicalConditions || []}
          />
        </View>
        
        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveMeal}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Add to Today\'s Meals'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      {saving && <LoadingOverlay message="Saving to meal history..." />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  foodImage: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.gray[300],
  },
  detailsContainer: {
    padding: 20,
  },
  foodName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 4,
  },
  servingInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 16,
  },
  macrosContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary,
  },
  macroLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
  },
  recommendationsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  recommendationIcon: {
    backgroundColor: Colors.success,
    borderRadius: 12,
    padding: 4,
    marginRight: 10,
  },
  recommendationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
    flex: 1,
  },
  nutritionContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 20,
    borderRadius: 12,
  },
  saveButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  backButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.white,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.error,
    marginBottom: 20,
  },
});