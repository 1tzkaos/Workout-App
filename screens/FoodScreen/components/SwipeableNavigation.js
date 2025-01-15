import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Animated,
  PanResponder,
  useWindowDimensions,
  StyleSheet,
} from "react-native";

export function SwipeableNavigator({ children, navigation }) {
  const pan = useRef(new Animated.Value(0)).current;
  const layout = useWindowDimensions();
  const [screens, setScreens] = useState({
    prev: null,
    next: null,
  });
  const [canSwipe, setCanSwipe] = useState({
    left: false,
    right: false,
  });

  useEffect(() => {
    const state = navigation.getState();
    const index = state.index;
    const routes = state.routes;

    // Update screens and swipe capabilities
    setScreens({
      prev: index > 0 ? routes[index - 1].name : null,
      next: index < routes.length - 1 ? routes[index + 1].name : null,
    });
    setCanSwipe({
      left: index > 0,
      right: index < routes.length - 1,
    });
  }, [navigation]);

  const renderScreen = (routeName) => {
    if (!routeName) return null;

    switch (routeName) {
      case "Sets":
        return <SetsStack navigation={navigation} />;
      case "Food":
        return <FoodScreen navigation={navigation} />;
      case "Weight":
        return <WeightScreen navigation={navigation} />;
      default:
        return null;
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      // Sensitive to horizontal movement
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 100
        );
      },
      onPanResponderMove: (_, gestureState) => {
        // Allow moving if swiping left and right screens exist
        if (
          (gestureState.dx > 0 && canSwipe.left) ||
          (gestureState.dx < 0 && canSwipe.right)
        ) {
          pan.setValue(gestureState.dx);
        } else {
          // Add some resistance if trying to swipe beyond available screens
          pan.setValue(gestureState.dx / 3);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        const screenWidth = layout.width;

        // Navigate if swiped more than 40% of screen width
        if (Math.abs(dx) > screenWidth * 0.4) {
          const navigateTo = dx > 0 ? screens.prev : screens.next;
          if (navigateTo) {
            navigation.navigate(navigateTo);
          }
        }

        // Always spring back to original position
        Animated.spring(pan, {
          toValue: 0,
          useNativeDriver: true,
          tension: 10,
          friction: 3,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      {screens.prev && (
        <Animated.View
          style={[
            styles.adjacentScreen,
            {
              transform: [
                {
                  translateX: pan.interpolate({
                    inputRange: [-layout.width, 0, layout.width],
                    outputRange: [-layout.width, -layout.width, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {renderScreen(screens.prev)}
        </Animated.View>
      )}

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

      {screens.next && (
        <Animated.View
          style={[
            styles.adjacentScreen,
            {
              transform: [
                {
                  translateX: pan.interpolate({
                    inputRange: [-layout.width, 0, layout.width],
                    outputRange: [0, layout.width, layout.width],
                  }),
                },
              ],
            },
          ]}
        >
          {renderScreen(screens.next)}
        </Animated.View>
      )}
    </View>
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
