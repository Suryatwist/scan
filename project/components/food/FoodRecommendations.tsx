import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import { getAlternativeRecommendations } from '@/services/recommendationService';

interface Props {
  foodId: string;
  foodType: string;
  healthProfile: string[];
}

interface FoodSuggestion {
  id: string;
  name: string;
  imageUrl: string;
  reason: string;
}

export default function FoodRecommendations({ foodId, foodType, healthProfile }: Props) {
  const [recommendations, setRecommendations] = useState<FoodSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const data = await getAlternativeRecommendations(foodId, foodType, healthProfile);
        setRecommendations(data);
      } catch (error) {
        console.error('Error loading food recommendations:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadRecommendations();
  }, [foodId, foodType, healthProfile]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Healthier Alternatives</Text>
        <Text style={styles.loadingText}>Loading recommendations...</Text>
      </View>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Healthier Alternatives</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recommendationsContainer}
      >
        {recommendations.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.recommendationCard}
            onPress={() => router.push({
              pathname: '/food-details',
              params: { foodId: item.id }
            })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.recommendationImage} />
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationTitle} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.recommendationReason} numberOfLines={2}>{item.reason}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 12,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    fontStyle: 'italic',
  },
  recommendationsContainer: {
    paddingBottom: 8,
  },
  recommendationCard: {
    width: 150,
    backgroundColor: Colors.white,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendationImage: {
    width: '100%',
    height: 100,
    backgroundColor: Colors.gray[300],
  },
  recommendationContent: {
    padding: 8,
  },
  recommendationTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
  },
  recommendationReason: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
  },
});