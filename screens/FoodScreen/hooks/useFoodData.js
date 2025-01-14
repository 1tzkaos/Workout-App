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
        calories: +(acc.calories + meal.calories).toFixed(1),
        protein: +(acc.protein + meal.protein).toFixed(1),
        carbs: +(acc.carbs + meal.carbs).toFixed(1),
        fat: +(acc.fat + meal.fat).toFixed(1),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    setTodaysMacros(totals);
  };

  const updateDailyGoals = async (newGoals) => {
    try {
      await AsyncStorage.setItem("@daily_goals", JSON.stringify(newGoals));
      setDailyGoals(newGoals);
    } catch (error) {
      console.error("Error saving daily goals:", error);
      Alert.alert(
        "Error",
        "There was a problem saving your goals. Please try again."
      );
    }
  };

  const addMeal = async (selectedFood, servings = 1) => {
    try {
      const newMeal = {
        id: Date.now().toString(),
        name: selectedFood.description,
        calories: +(
          getNutrientValue(selectedFood, "Energy") * servings
        ).toFixed(1),
        protein: +(
          getNutrientValue(selectedFood, "Protein") * servings
        ).toFixed(1),
        carbs: +(
          getNutrientValue(selectedFood, "Carbohydrate, by difference") *
          servings
        ).toFixed(1),
        fat: +(
          getNutrientValue(selectedFood, "Total lipid (fat)") * servings
        ).toFixed(1),
        servingSize: +(selectedFood.servingSize || 100).toFixed(1),
        servings: +servings.toFixed(1),
        timestamp: new Date().toISOString(),
      };

      const updatedMeals = [...meals, newMeal];
      await AsyncStorage.setItem("@today_meals", JSON.stringify(updatedMeals));
      setMeals(updatedMeals);
      calculateTodaysMacros(updatedMeals);

      return true;
    } catch (error) {
      console.error("Error adding meal:", error);
      Alert.alert(
        "Error",
        "There was a problem adding your meal. Please try again."
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

  const clearAllMeals = async () => {
    try {
      await AsyncStorage.removeItem("@today_meals");
      setMeals([]);
      calculateTodaysMacros([]);

      return true;
    } catch (error) {
      console.error("Error clearing meals:", error);
      Alert.alert(
        "Error",
        "There was a problem clearing your meals. Please try again."
      );
      return false;
    }
  };

  const getMealsByDate = async (date) => {
    try {
      const savedMeals = await AsyncStorage.getItem("@today_meals");
      if (savedMeals) {
        const allMeals = JSON.parse(savedMeals);
        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        return allMeals.filter((meal) => {
          const mealDate = new Date(meal.timestamp);
          return mealDate >= dayStart && mealDate <= dayEnd;
        });
      }
      return [];
    } catch (error) {
      console.error("Error getting meals by date:", error);
      return [];
    }
  };

  return {
    dailyGoals,
    todaysMacros,
    meals,
    updateDailyGoals,
    addMeal,
    deleteMeal,
    clearAllMeals,
    calculateTodaysMacros,
    getMealsByDate,
  };
};
