// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";
import AddSetScreen from "./screens/AddSetScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000000" },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="ExerciseDetail"
            component={ExerciseDetailScreen}
          />
          <Stack.Screen name="AddSet" component={AddSetScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
