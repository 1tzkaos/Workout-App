// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import FoodScreen from "./screens/FoodScreen/index";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

function SwipeableScreen({ children, navigation, routeName }) {
  const pan = React.useRef(new Animated.Value(0)).current;
  const layout = useWindowDimensions();

  const [adjacentScreens, setAdjacentScreens] = React.useState({
    prev: null,
    next: null,
  });

  React.useEffect(() => {
    const state = navigation.getState();
    const currentIndex = state.routes.findIndex(
      (route) => route.name === routeName
    );

    setAdjacentScreens({
      prev: currentIndex > 0 ? state.routes[currentIndex - 1] : null,
      next:
        currentIndex < state.routes.length - 1
          ? state.routes[currentIndex + 1]
          : null,
    });
  }, [navigation, routeName]);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);
        return dx > dy && dx > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (
          (!adjacentScreens.prev && gestureState.dx > 0) ||
          (!adjacentScreens.next && gestureState.dx < 0)
        ) {
          pan.setValue(gestureState.dx / 1.5);
        } else {
          pan.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = layout.width * 0.2;

        if (Math.abs(gestureState.dx) > threshold) {
          if (gestureState.dx > 0 && adjacentScreens.prev) {
            navigation.navigate(adjacentScreens.prev.name);
          } else if (gestureState.dx < 0 && adjacentScreens.next) {
            navigation.navigate(adjacentScreens.next.name);
          }
        }

        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }).start();
      },
    })
  ).current;

  const renderAdjacentScreen = (screen, position) => {
    if (!screen) return null;

    const transform =
      position === "prev"
        ? [
            {
              translateX: pan.interpolate({
                inputRange: [-layout.width, 0, layout.width],
                outputRange: [-layout.width, -layout.width, 0],
              }),
            },
          ]
        : [
            {
              translateX: pan.interpolate({
                inputRange: [-layout.width, 0, layout.width],
                outputRange: [0, layout.width, layout.width],
              }),
            },
          ];

    return (
      <Animated.View style={[styles.adjacentScreen, { transform }]}>
        {getScreenComponent(screen.name, navigation)}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderAdjacentScreen(adjacentScreens.prev, "prev")}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.currentScreen,
          {
            transform: [{ translateX: pan }],
          },
        ]}
      >
        {children}
      </Animated.View>
      {renderAdjacentScreen(adjacentScreens.next, "next")}
    </View>
  );
}

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

function getScreenComponent(name, navigation) {
  switch (name) {
    case "Sets":
      return <SetsStack navigation={navigation} />;
    case "Food":
      return <FoodScreen navigation={navigation} />;
    case "Weight":
      return <WeightScreen navigation={navigation} />;
    default:
      return null;
  }
}

function TabNavigator() {
  return (
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
            <MaterialCommunityIcons name="dumbbell" color={color} size={24} />
          ),
        }}
      >
        {(props) => (
          <SwipeableScreen {...props} routeName="Sets">
            <SetsStack {...props} />
          </SwipeableScreen>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Food"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="food-apple" color={color} size={24} />
          ),
        }}
      >
        {(props) => (
          <SwipeableScreen {...props} routeName="Food">
            <FoodScreen {...props} />
          </SwipeableScreen>
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
          <SwipeableScreen {...props} routeName="Weight">
            <WeightScreen {...props} />
          </SwipeableScreen>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  currentScreen: {
    flex: 1,
  },
  adjacentScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#121212",
  },
});
