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

  useEffect(() => {
    const state = navigation.getState();
    const index = state.index;
    const routes = state.routes;

    setScreens({
      prev: index > 0 ? routes[index - 1].name : null,
      next: index < routes.length - 1 ? routes[index + 1].name : null,
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
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 50;
      },
      onPanResponderMove: (_, gestureState) => {
        if (
          (!screens.prev && gestureState.dx > 0) ||
          (!screens.next && gestureState.dx < 0)
        ) {
          pan.setValue(gestureState.dx / 3); // Add resistance when no screen available
        } else {
          pan.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) > layout.width * 0.4) {
          const navigateTo = gestureState.dx > 0 ? screens.prev : screens.next;
          if (navigateTo) {
            navigation.navigate(navigateTo);
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
