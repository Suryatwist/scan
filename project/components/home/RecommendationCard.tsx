import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';

interface Props {
  title: string;
  description: string;
  image: string;
  reason: string;
}

export default function RecommendationCard({ title, description, image, reason }: Props) {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => {
        // Navigate to detailed recommendation
        // This is a placeholder - in a real app, you'd navigate to a specific screen
        console.log('Navigate to recommendation:', title);
      }}
    >
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        <View style={styles.reasonContainer}>
          <Text style={styles.reasonText}>{reason}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.gray[300],
  },
  content: {
    padding: 12,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  reasonContainer: {
    backgroundColor: Colors.gray[200],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  reasonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: Colors.gray[700],
  },
});