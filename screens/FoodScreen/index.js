// src/screens/FoodScreen/index.js
import React, { useState } from "react";
import { View, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Header from "./components/Header";
import DailyProgress from "./components/DailyProgress";
import SearchBar from "./components/SearchBar";
import MealsList from "./components/MealsList";
import GoalsModal from "./components/GoalsModal";
import SearchResultsModal from "./components/SearchResultsModal";
import NutritionModal from "./components/NutritionModal";
import { useFoodData } from "./hooks/useFoodData";
import { useSearch } from "./hooks/useSearch";
import styles from "./styles";

export default function FoodScreen() {
  const insets = useSafeAreaInsets();
  const {
    dailyGoals,
    todaysMacros,
    meals,
    setDailyGoals,
    deleteMeal,
    addMeal,
  } = useFoodData();

  const {
    searchQuery,
    searchResults,
    isSearching,
    selectedFood,
    setSearchQuery,
    searchFood,
    handleFoodSelect,
    clearSearch,
    setSelectedFood,
    setSearchResults,
  } = useSearch();

  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const closeAllModals = () => {
    setShowSearchResults(false);
    setShowNutritionModal(false);

    setSelectedFood(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleAddFood = async (food, servings) => {
    const success = await addMeal(food, servings);
    if (success) {
      // Close everything immediately when adding food
      closeAllModals();
    }
  };

  const handleCloseNutritionModal = () => {
    // Just close the nutrition modal and return to search results
    setShowNutritionModal(false);
    setSelectedFood(null);
  };

  const handleCloseSearchResults = () => {
    // Close everything when closing search results
    closeAllModals();
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />

        <Header onSettingsPress={() => setShowGoalsModal(true)} />
        <DailyProgress dailyGoals={dailyGoals} todaysMacros={todaysMacros} />
        <SearchBar
          searchQuery={searchQuery}
          isSearching={isSearching}
          onChangeText={setSearchQuery}
          onSubmit={() => {
            setShowSearchResults(true);
            searchFood();
          }}
        />
        <MealsList meals={meals} onDelete={deleteMeal} />

        <GoalsModal
          visible={showGoalsModal}
          dailyGoals={dailyGoals}
          onSave={setDailyGoals}
          onClose={() => setShowGoalsModal(false)}
        />

        <SearchResultsModal
          visible={
            showSearchResults && (isSearching || searchResults.length > 0)
          }
          results={searchResults}
          isSearching={isSearching}
          onSelect={(food) => {
            handleFoodSelect(food);
            setShowNutritionModal(true);
          }}
          onClose={handleCloseSearchResults}
        />

        <NutritionModal
          visible={showNutritionModal}
          food={selectedFood}
          onAdd={handleAddFood}
          onClose={handleCloseNutritionModal}
        />
      </View>
    </GestureHandlerRootView>
  );
}
