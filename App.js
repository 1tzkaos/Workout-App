// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./screens/HomeScreen";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";
import AddSetScreen from "./screens/AddSetScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import AddExerciseScreen from "./screens/AddExerciseScreen";
import FoodScreen from "./screens/FoodScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#000000" },
            gestureEnabled: true,
            gestureDirection: "horizontal",
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Food" component={FoodScreen} />
          <Stack.Screen
            name="ExerciseDetail"
            component={ExerciseDetailScreen}
          />
          <Stack.Screen name="AddSet" component={AddSetScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen
            name="AddExercise"
            component={AddExerciseScreen}
            options={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
