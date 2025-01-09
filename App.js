// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, useWindowDimensions } from "react-native";

import HomeScreen from "./screens/HomeScreen";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";
import AddSetScreen from "./screens/AddSetScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import AddExerciseScreen from "./screens/AddExerciseScreen";
import FoodScreen from "./screens/FoodScreen";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

// Stack navigator for the Sets tab
function SetsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000000" },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
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
  );
}

// Placeholder Weight Screen
function WeightScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
      }}
    >
      <MaterialCommunityIcons name="scale-bathroom" size={48} color="#3498db" />
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 16,
        }}
      >
        Weight tracking coming soon
      </Text>
    </View>
  );
}

// Custom tab bar component
function CustomTabBar({ state, descriptors, navigation, position }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#1E1E1E",
        height: 85,
        borderTopWidth: 1,
        borderTopColor: "#2D2D2D",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        let iconName;
        switch (route.name) {
          case "Sets":
            iconName = "dumbbell";
            break;
          case "Food":
            iconName = "food-apple";
            break;
          case "Weight":
            iconName = "scale-bathroom";
            break;
          default:
            iconName = "circle";
        }

        return (
          <View
            key={index}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <MaterialCommunityIcons
              name={iconName}
              size={24}
              color={isFocused ? "#3498db" : "#B3B3B3"}
            />
            <Text
              style={{
                color: isFocused ? "#3498db" : "#B3B3B3",
                fontSize: 13,
                fontWeight: "500",
                marginTop: 4,
              }}
            >
              {route.name}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function App() {
  const layout = useWindowDimensions();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            tabBarShowLabel: false,
            swipeEnabled: true,
            animationEnabled: true,
          }}
          initialLayout={{ width: layout.width }}
        >
          <Tab.Screen name="Sets" component={SetsStack} />
          <Tab.Screen name="Food" component={FoodScreen} />
          <Tab.Screen name="Weight" component={WeightScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
