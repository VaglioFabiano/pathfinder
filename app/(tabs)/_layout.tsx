import { Tabs, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MapView from 'react-native-maps';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route, navigation }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            backgroundColor: '#979797',
            position: 'absolute',
          },
          default: {},
        }),
        listeners: {
          tabPress: () => {
            // Forza il refresh quando il tab viene premuto
            navigation.navigate(route.name, { key: Math.random() });
          },
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="map-marked-alt" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addtrail"
        options={{
          title: 'Add Trail',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map-marker-plus-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
