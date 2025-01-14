// src/screens/FoodScreen/components/MealItem.js
import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import styles from "../styles";

export default function MealItem({ meal, onDelete }) {
  const swipeableRef = useRef(null);

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.deleteContainer,
          {
            opacity: opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete(meal.id);
          }}
        >
          <Animated.Text
            style={[
              styles.deleteButtonText,
              {
                transform: [{ scale }],
              },
            ]}
          >
            Delete
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX)
      }
      overshootRight={false}
      rightThreshold={40}
      friction={2}
      useNativeAnimations
    >
      <View style={styles.mealItem}>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealMacros}>
          {meal.calories} cal • {meal.protein}p • {meal.carbs}c • {meal.fat}f
        </Text>
      </View>
    </Swipeable>
  );
}
