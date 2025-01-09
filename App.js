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
  useWindowDimensions,
  StyleSheet,
} from "react-native";

import HomeScreen from "./screens/HomeScreen";
import ExerciseDetailScreen from "./screens/ExerciseDetailScreen";
import AddSetScreen from "./screens/AddSetScreen";
import AnalyticsScreen from "./screens/AnalyticsScreen";
import AddExerciseScreen from "./screens/AddExerciseScreen";
import FoodScreen from "./screens/FoodScreen";

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
  const layout = useWindowDimensions();
  const [screens, setScreens] = React.useState({
    prev: null,
    next: null,
  });

  React.useEffect(() => {
    const state = navigation.getState();
    const index = state.index;

    setScreens({
      prev: index > 0 ? state.routes[index - 1].name : null,
      next:
        index < state.routes.length - 1 ? state.routes[index + 1].name : null,
    });
  }, [navigation.getState().index]);

  const renderScreen = (routeName) => {
    const screenProps = { navigation };
    switch (routeName) {
      case "Sets":
        return <SetsStack {...screenProps} />;
      case "Food":
        return <FoodScreen {...screenProps} />;
      case "Weight":
        return <WeightScreen {...screenProps} />;
      default:
        return null;
    }
  };

  const translatePrev = pan.interpolate({
    inputRange: [-layout.width, 0, layout.width],
    outputRange: [-layout.width, -layout.width, 0],
  });

  const translateNext = pan.interpolate({
    inputRange: [-layout.width, 0, layout.width],
    outputRange: [0, layout.width, layout.width],
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20;
    },
    onPanResponderMove: (_, gestureState) => {
      pan.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      // Only navigate if the touch is released
      if (Math.abs(gestureState.dx) > layout.width * 0.5) {
        const navigateTo = gestureState.dx > 0 ? screens.prev : screens.next;
        if (navigateTo) {
          navigation.navigate(navigateTo);
        }
      }

      // Always animate back to origin if released
      Animated.spring(pan, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#121212" }}>
      {screens.prev && (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: -1,
            transform: [{ translateX: translatePrev }],
          }}
        >
          {renderScreen(screens.prev)}
        </Animated.View>
      )}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          flex: 1,
          transform: [{ translateX: pan }],
        }}
      >
        {children}
      </Animated.View>
      {screens.next && (
        <Animated.View
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: -1,
            transform: [{ translateX: translateNext }],
          }}
        >
          {renderScreen(screens.next)}
        </Animated.View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
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
