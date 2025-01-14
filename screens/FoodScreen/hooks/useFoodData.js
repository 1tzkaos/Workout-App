// src/screens/FoodScreen/hooks/useFoodData.js
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Alert } from "react-native";
import { getNutrientValue } from "../utils/nutrition";

export const useFoodData = () => {
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  });

  const [todaysMacros, setTodaysMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const [meals, setMeals] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadSavedData();
    }, [])
  );

  const loadSavedData = async () => {
    try {
      const [savedGoals, savedMeals] = await Promise.all([
        AsyncStorage.getItem("@daily_goals"),
        AsyncStorage.getItem("@today_meals"),
      ]);

      if (savedGoals) {
        setDailyGoals(JSON.parse(savedGoals));
      }

      if (savedMeals) {
        const parsedMeals = JSON.parse(savedMeals);
        setMeals(parsedMeals);
        calculateTodaysMacros(parsedMeals);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
      Alert.alert(
        "Error",
        "There was a problem loading your saved data. Please try again."
      );
    }
  };

  const calculateTodaysMacros = (mealsList) => {
    const totals = mealsList.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    setTodaysMacros(totals);
  };

  const handleAddFood = async (selectedFood) => {
    try {
      if (!selectedFood) return;

      const newMeal = {
        id: Date.now().toString(),
        name: selectedFood.description,
        calories: getNutrientValue(selectedFood, "Energy"),
        protein: getNutrientValue(selectedFood, "Protein"),
        carbs: getNutrientValue(selectedFood, "Carbohydrate, by difference"),
        fat: getNutrientValue(selectedFood, "Total lipid (fat)"),
        servingSize: selectedFood.servingSize || 100,
        timestamp: new Date().toISOString(),
      };

      const updatedMeals = [...meals, newMeal];
      await AsyncStorage.setItem("@today_meals", JSON.stringify(updatedMeals));
      setMeals(updatedMeals);
      calculateTodaysMacros(updatedMeals);
      return true;
    } catch (error) {
      console.error("Error adding food:", error);
      Alert.alert(
        "Error",
        "There was a problem adding the food. Please try again."
      );
      return false;
    }
  };

  const deleteMeal = async (mealId) => {
    try {
      const updatedMeals = meals.filter((meal) => meal.id !== mealId);
      await AsyncStorage.setItem("@today_meals", JSON.stringify(updatedMeals));
      setMeals(updatedMeals);
      calculateTodaysMacros(updatedMeals);
      return true;
    } catch (error) {
      console.error("Error deleting meal:", error);
      Alert.alert(
        "Error",
        "There was a problem deleting the meal. Please try again."
      );
      return false;
    }
  };

  return {
    dailyGoals,
    todaysMacros,
    meals,
    setDailyGoals,
    handleAddFood,
    deleteMeal,
    calculateTodaysMacros,
  };
};
