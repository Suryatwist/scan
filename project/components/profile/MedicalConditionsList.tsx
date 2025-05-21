import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { MedicalCondition } from '@/types/user';

interface Props {
  conditions: MedicalCondition[];
  allergies: string[];
}

export default function MedicalConditionsList({ conditions, allergies }: Props) {
  if (conditions.length === 0 && allergies.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No medical conditions or allergies added</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {conditions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Conditions:</Text>
          {conditions.map((condition, index) => (
            <View key={index} style={styles.conditionItem}>
              <AlertCircle size={16} color={Colors.warning} />
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
          ))}
        </View>
      )}
      
      {allergies.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies:</Text>
          {allergies.map((allergy, index) => (
            <View key={index} style={styles.conditionItem}>
              <AlertCircle size={16} color={Colors.error} />
              <Text style={styles.conditionText}>{allergy}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: Colors.gray[700],
    marginBottom: 8,
  },
  conditionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  conditionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[800],
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 10,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[500],
    fontStyle: 'italic',
  },
});