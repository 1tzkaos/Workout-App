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

const FoodScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    dailyGoals,
    todaysMacros,
    meals,
    setDailyGoals,
    handleAddFood,
    deleteMeal,
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
  } = useSearch();

  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showNutritionModal, setShowNutritionModal] = useState(false);

  const handleFoodSelection = (food) => {
    handleFoodSelect(food);
    setShowNutritionModal(true);
  };

  const handleAddFoodAndClose = async () => {
    if (selectedFood) {
      const success = await handleAddFood(selectedFood);
      if (success) {
        setShowNutritionModal(false);
        clearSearch();
      }
    }
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
          onSubmit={searchFood}
        />

        <MealsList meals={meals} onDelete={deleteMeal} />

        <GoalsModal
          visible={showGoalsModal}
          dailyGoals={dailyGoals}
          onSave={setDailyGoals}
          onClose={() => setShowGoalsModal(false)}
        />

        <SearchResultsModal
          visible={isSearching || searchResults.length > 0}
          results={searchResults}
          isSearching={isSearching}
          onSelect={handleFoodSelection}
          onClose={clearSearch}
        />

        <NutritionModal
          visible={showNutritionModal}
          food={selectedFood}
          onAdd={handleAddFoodAndClose}
          onClose={() => {
            setShowNutritionModal(false);
            clearSearch();
          }}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default FoodScreen;
