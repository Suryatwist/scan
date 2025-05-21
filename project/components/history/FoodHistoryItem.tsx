import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Food } from '@/types/food';

interface Props {
  food: Food;
  onPress: () => void;
}

export default function FoodHistoryItem({ food, onPress }: Props) {
  // Format the time
  const time = new Date(food.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <Image source={{ uri: food.imageUrl }} style={styles.foodImage} />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodDetails}>
            {food.weight}g • {food.nutrition.calories} kcal
          </Text>
          <View style={styles.macrosContainer}>
            <Text style={styles.macroText}>
              C: {food.nutrition.carbs}g • P: {food.nutrition.protein}g • F: {food.nutrition.fat}g
            </Text>
          </View>
        </View>
        
        <ChevronRight size={20} color={Colors.gray[400]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  timeContainer: {
    marginBottom: 4,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.gray[300],
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  foodName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.primary,
  },
  foodDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
    marginVertical: 2,
  },
  macrosContainer: {
    flexDirection: 'row',
  },
  macroText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
  },
});