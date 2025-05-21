import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, User, Activity, Heart, Scale, Target, AlertCircle, Settings } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useUser } from '@/context/UserContext';
import ProfileSection from '@/components/profile/ProfileSection';
import MedicalConditionsList from '@/components/profile/MedicalConditionsList';

export default function ProfileScreen() {
  const { user, logout } = useUser();

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} 
            style={styles.profileImage} 
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'User Name'}</Text>
          <Text style={styles.profileDetail}>{user?.age || 30} years • {user?.gender || 'Male'}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Body Metrics */}
      <ProfileSection 
        icon={<Scale size={20} color={Colors.primary} />}
        title="Body Metrics" 
      >
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{user?.weight || 70}</Text>
            <Text style={styles.metricLabel}>Weight (kg)</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{user?.height || 175}</Text>
            <Text style={styles.metricLabel}>Height (cm)</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>{user?.bmi || '22.9'}</Text>
            <Text style={styles.metricLabel}>BMI</Text>
          </View>
        </View>
      </ProfileSection>

      {/* Fitness Goals */}
      <ProfileSection 
        icon={<Target size={20} color={Colors.primary} />}
        title="Fitness Goals" 
      >
        <View style={styles.goalContainer}>
          <View style={[styles.goalBadge, { backgroundColor: Colors.accent }]}>
            <Text style={styles.goalText}>{user?.fitnessGoal || 'Weight Maintenance'}</Text>
          </View>
        </View>
      </ProfileSection>

      {/* Medical Conditions */}
      <ProfileSection 
        icon={<Heart size={20} color={Colors.primary} />}
        title="Medical Conditions" 
      >
        <MedicalConditionsList 
          conditions={user?.medicalConditions || []} 
          allergies={user?.allergies || []}
        />
      </ProfileSection>

      {/* Dietary Preferences */}
      <ProfileSection 
        icon={<Utensils size={20} color={Colors.primary} />}
        title="Dietary Preferences" 
      >
        <View style={styles.dietaryContainer}>
          {(user?.dietaryPreferences || ['Balanced Diet']).map((preference, index) => (
            <View key={index} style={styles.dietaryBadge}>
              <Text style={styles.dietaryText}>{preference}</Text>
            </View>
          ))}
        </View>
      </ProfileSection>

      {/* Settings */}
      <TouchableOpacity style={styles.settingsButton}>
        <Settings size={20} color={Colors.primary} />
        <Text style={styles.settingsText}>Settings</Text>
        <ChevronRight size={20} color={Colors.gray[400]} />
      </TouchableOpacity>
      
      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  profileImageContainer: {
    height: 80,
    width: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: Colors.gray[300],
    marginRight: 16,
  },
  profileImage: {
    height: '100%',
    width: '100%',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 4,
  },
  profileDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.white,
  },
  metricsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.primary,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.gray[600],
  },
  goalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  goalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  goalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.white,
  },
  dietaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  dietaryBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  dietaryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.white,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray[200],
  },
  settingsText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 10,
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray[200],
  },
  logoutText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.error,
  },
});