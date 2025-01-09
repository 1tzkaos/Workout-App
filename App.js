import HomeScreen from "./screens/HomeScreen";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";
import AddSetScreen from "./screens/AddSetScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import AddExerciseScreen from "./screens/AddExerciseScreen";
import FoodScreen from "./screens/FoodScreen";

// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

function SwipeableNavigator({ children, navigation }) {
  const pan = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (_, gestureState) => {
        pan.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentIndex = navigation.getState().index;
        const screenWidth = 200;

        if (Math.abs(gestureState.dx) > screenWidth / 3) {
          if (gestureState.dx > 0 && currentIndex > 0) {
            navigation.navigate(
              navigation.getState().routeNames[currentIndex - 1]
            );
          } else if (gestureState.dx < 0 && currentIndex < 2) {
            navigation.navigate(
              navigation.getState().routeNames[currentIndex + 1]
            );
          }
        }

        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        flex: 1,
        transform: [{ translateX: pan }],
      }}
    >
      {children}
    </Animated.View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ navigation }) => ({
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#1E1E1E",
              borderTopColor: "#2D2D2D",
              borderTopWidth: 1,
              height: 85,
            },
            tabBarActiveTintColor: "#3498db",
            tabBarInactiveTintColor: "#B3B3B3",
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: "500",
            },
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={() => {
                  const targetIndex = navigation
                    .getState()
                    .routes.findIndex(
                      (route) => route.name === props.route.name
                    );
                  navigation.navigate(props.route.name);
                }}
              />
            ),
          })}
        >
          <Tab.Screen
            name="Sets"
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="dumbbell"
                  color={color}
                  size={24}
                />
              ),
            }}
          >
            {(props) => (
              <SwipeableNavigator {...props}>
                <SetsStack {...props} />
              </SwipeableNavigator>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Food"
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="food-apple"
                  color={color}
                  size={24}
                />
              ),
            }}
          >
            {(props) => (
              <SwipeableNavigator {...props}>
                <FoodScreen {...props} />
              </SwipeableNavigator>
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Weight"
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="scale-bathroom"
                  color={color}
                  size={24}
                />
              ),
            }}
          >
            {(props) => (
              <SwipeableNavigator {...props}>
                <WeightScreen {...props} />
              </SwipeableNavigator>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
