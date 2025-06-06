// filepath: /Users/pavankumarbakku/Documents/proapp/src/Navigation.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from './Dashboard';
import Quiz from './QuizComponent'; // Import your Quiz component
import OTPComponent from './Login/Login';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="Login" component={OTPComponent} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Quiz" component={Quiz} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
