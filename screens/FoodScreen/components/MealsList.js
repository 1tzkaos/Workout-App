// src/screens/FoodScreen/components/MealsList.js
import React from "react";
import { ScrollView } from "react-native";
import MealItem from "./MealItem";
import styles from "../styles";

export default function MealsList({ meals, onDelete }) {
  return (
    <ScrollView style={styles.mealsList}>
      {meals.map((meal) => (
        <MealItem key={meal.id} meal={meal} onDelete={onDelete} />
      ))}
    </ScrollView>
  );
}
