import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import { User, FitnessGoal, MedicalCondition } from '@/types/user';

export default function EditProfileScreen() {
  const { user, updateUser } = useUser();
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || '',
    age: user?.age || 30,
    gender: user?.gender || 'Male',
    weight: user?.weight || 70,
    height: user?.height || 175,
    fitnessGoal: user?.fitnessGoal || 'Weight Maintenance',
    medicalConditions: user?.medicalConditions || [],
    allergies: user?.allergies || [],
    dietaryPreferences: user?.dietaryPreferences || ['Balanced Diet'],
  });

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleMedicalCondition = (condition: MedicalCondition) => {
    const medicalConditions = [...(formData.medicalConditions || [])];
    const index = medicalConditions.indexOf(condition);
    
    if (index === -1) {
      medicalConditions.push(condition);
    } else {
      medicalConditions.splice(index, 1);
    }
    
    handleInputChange('medicalConditions', medicalConditions);
  };

  const hasMedicalCondition = (condition: MedicalCondition): boolean => {
    return (formData.medicalConditions || []).includes(condition);
  };

  const toggleFitnessGoal = (goal: FitnessGoal) => {
    handleInputChange('fitnessGoal', goal);
  };

  const handleSave = async () => {
    try {
      if (!formData.name?.trim()) {
        Alert.alert('Error', 'Name is required');
        return;
      }
      
      // Calculate BMI
      const heightInMeters = (formData.height || 0) / 100;
      const bmi = ((formData.weight || 0) / (heightInMeters * heightInMeters)).toFixed(1);
      
      // Update daily targets based on user profile
      const dailyTarget = calculateDailyTarget(formData);
      
      await updateUser({
        ...formData,
        bmi,
        dailyTarget,
      } as User);
      
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const calculateDailyTarget = (userData: Partial<User>) => {
    const { gender, weight, height, age, fitnessGoal } = userData;
    
    // Base calculation using Harris-Benedict equation
    let bmr = 0;
    if (gender === 'Male') {
      bmr = 88.362 + (13.397 * (weight || 70)) + (4.799 * (height || 175)) - (5.677 * (age || 30));
    } else {
      bmr = 447.593 + (9.247 * (weight || 70)) + (3.098 * (height || 175)) - (4.330 * (age || 30));
    }
    
    // Adjust based on fitness goal
    let calorieTarget = bmr * 1.2; // Sedentary multiplier
    let proteinTarget = (weight || 70) * 1.2; // Base protein requirement
    
    if (fitnessGoal === 'Fat Loss') {
      calorieTarget *= 0.8; // 20% deficit
      proteinTarget *= 1.5; // Higher protein for fat loss
    } else if (fitnessGoal === 'Muscle Gain') {
      calorieTarget *= 1.15; // 15% surplus
      proteinTarget *= 2; // Higher protein for muscle gain
    }
    
    // Calculate other macros
    const fatTarget = (calorieTarget * 0.3) / 9; // 30% of calories from fat
    const carbTarget = (calorieTarget - (proteinTarget * 4) - (fatTarget * 9)) / 4; // Remaining calories from carbs
    
    return {
      calories: Math.round(calorieTarget),
      protein: Math.round(proteinTarget),
      fat: Math.round(fatTarget),
      carbs: Math.round(carbTarget),
      fiber: 25, // Standard recommendation
    };
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container}>
        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.textInput}
            value={formData.name?.toString()}
            onChangeText={(text) => handleInputChange('name', text)}
            placeholder="Your name"
          />
          
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={styles.textInput}
            value={formData.age?.toString()}
            onChangeText={(text) => handleInputChange('age', parseInt(text) || 0)}
            keyboardType="number-pad"
            placeholder="Your age"
          />
          
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.gender === 'Male' && styles.radioButtonSelected
              ]}
              onPress={() => handleInputChange('gender', 'Male')}
            >
              <Text style={[
                styles.radioButtonText,
                formData.gender === 'Male' && styles.radioButtonTextSelected
              ]}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                formData.gender === 'Female' && styles.radioButtonSelected
              ]}
              onPress={() => handleInputChange('gender', 'Female')}
            >
              <Text style={[
                styles.radioButtonText,
                formData.gender === 'Female' && styles.radioButtonTextSelected
              ]}>Female</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Body Metrics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Metrics</Text>
          
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={styles.textInput}
            value={formData.weight?.toString()}
            onChangeText={(text) => handleInputChange('weight', parseFloat(text) || 0)}
            keyboardType="decimal-pad"
            placeholder="Your weight in kg"
          />
          
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={styles.textInput}
            value={formData.height?.toString()}
            onChangeText={(text) => handleInputChange('height', parseFloat(text) || 0)}
            keyboardType="decimal-pad"
            placeholder="Your height in cm"
          />
        </View>
        
        {/* Fitness Goals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Goals</Text>
          
          <TouchableOpacity
            style={[
              styles.goalButton,
              formData.fitnessGoal === 'Weight Maintenance' && styles.goalButtonSelected
            ]}
            onPress={() => toggleFitnessGoal('Weight Maintenance')}
          >
            <Text style={styles.goalButtonText}>Weight Maintenance</Text>
            {formData.fitnessGoal === 'Weight Maintenance' && (
              <Check size={20} color={Colors.white} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.goalButton,
              formData.fitnessGoal === 'Fat Loss' && styles.goalButtonSelected
            ]}
            onPress={() => toggleFitnessGoal('Fat Loss')}
          >
            <Text style={styles.goalButtonText}>Fat Loss</Text>
            {formData.fitnessGoal === 'Fat Loss' && (
              <Check size={20} color={Colors.white} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.goalButton,
              formData.fitnessGoal === 'Muscle Gain' && styles.goalButtonSelected
            ]}
            onPress={() => toggleFitnessGoal('Muscle Gain')}
          >
            <Text style={styles.goalButtonText}>Muscle Gain</Text>
            {formData.fitnessGoal === 'Muscle Gain' && (
              <Check size={20} color={Colors.white} />
            )}
          </TouchableOpacity>
        </View>
        
        {/* Medical Conditions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Conditions</Text>
          <Text style={styles.sectionSubtitle}>
            Select any medical conditions so we can provide personalized recommendations
          </Text>
          
          {['Diabetes', 'Hypertension', 'High Cholesterol', 'Thyroid Issues', 'PCOS'].map((condition, index) => (
            <View key={index} style={styles.switchRow}>
              <Text style={styles.switchLabel}>{condition}</Text>
              <Switch
                trackColor={{ false: Colors.gray[300], true: Colors.primary }}
                thumbColor={hasMedicalCondition(condition as MedicalCondition) ? Colors.white : Colors.white}
                onValueChange={() => toggleMedicalCondition(condition as MedicalCondition)}
                value={hasMedicalCondition(condition as MedicalCondition)}
              />
            </View>
          ))}
        </View>
        
        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
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
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 12,
  },
  inputLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 16,
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  radioButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  radioButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[700],
  },
  radioButtonTextSelected: {
    color: Colors.white,
  },
  goalButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  goalButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  goalButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.primary,
  },
  goalButtonTextSelected: {
    color: Colors.white,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  switchLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.gray[800],
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
});