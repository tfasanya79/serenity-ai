import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import { LoginScreen, RegisterScreen } from '../screens/auth';
import { MusicGenerationScreen } from '../screens/music';
import { ArtGenerationScreen } from '../screens/art';
import { HomeScreen } from '../screens/home';
import { LoadingScreen } from '../components/common';
import { useAuth } from '../contexts/AuthContext';

// Temporary placeholder components for other screens
const PlaceholderScreen = ({ route }: any) => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{route.name} Screen</Text>
      <Text>Coming Soon!</Text>
    </View>
  );
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator 
    screenOptions={{ 
      headerShown: false,
      cardStyle: { backgroundColor: 'transparent' }
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName = 'home';
        
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Music':
            iconName = 'music-note';
            break;
          case 'Art':
            iconName = 'palette';
            break;
          case 'Mood':
            iconName = 'mood';
            break;
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6200ee',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Music" component={MusicGenerationScreen} />
    <Tab.Screen name="Art" component={ArtGenerationScreen} />
    <Tab.Screen name="Mood" component={PlaceholderScreen} />
  </Tab.Navigator>
);

// Main Drawer Navigator
const MainDrawer = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerActiveTintColor: '#6200ee',
      drawerInactiveTintColor: 'gray',
      headerShown: true,
    }}
  >
    <Drawer.Screen 
      name="MainTabs" 
      component={MainTabs}
      options={{
        drawerLabel: 'Home',
        title: 'SerenityAI',
        drawerIcon: ({ focused, color, size }) => (
          <Icon name="home" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Profile" 
      component={PlaceholderScreen}
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <Icon name="person" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Settings" 
      component={PlaceholderScreen}
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <Icon name="settings" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="About" 
      component={PlaceholderScreen}
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <Icon name="info" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

// Root Navigator
export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <NavigationContainer>
      {isAuthenticated ? <MainDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
};
