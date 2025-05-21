import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import Colors from '@/constants/Colors';
import { UserProvider } from '@/context/UserContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <UserProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.primary,
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
        },
        headerShadowVisible: false,
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="food-details" options={{ title: 'Food Details' }} />
        <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile' }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
    </UserProvider>
  );
}