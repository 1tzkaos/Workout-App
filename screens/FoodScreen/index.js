// FoodScreen/index.js
import React, { useState } from "react";
import { View, StatusBar, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Header from "./components/Header";
import DailyProgress from "./components/DailyProgress";
import SearchBar from "./components/SearchBar";
import MealsList from "./components/MealsList";
import GoalsModal from "./components/GoalsModal";
import SearchResultsModal from "./components/SearchResultsModal";
import NutritionModal from "./components/NutritionModal";
import BarcodeScannerModal from "./components/BarcodeScannerModal";
import { useFoodData } from "./hooks/useFoodData";
import styles from "./styles";

export default function FoodScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    dailyGoals,
    todaysMacros,
    meals,
    setDailyGoals,
    deleteMeal,
    addMeal,
  } = useFoodData();

  // Local state for modals and search
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const USDA_API_KEY = "W2PkO4sB6D2ly6GrdQyoxsDdnkiPT9lNIEyUfsaT";
  const USDA_API_ENDPOINT = "https://api.nal.usda.gov/fdc/v1";

  const searchFood = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setIsSearching(true);
    try {
      console.log("Searching for:", searchQuery);

      const response = await fetch(
        `${USDA_API_ENDPOINT}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&dataType=Foundation,SR Legacy,Survey (FNDDS)&pageSize=25`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.foods || data.foods.length === 0) {
        Alert.alert("No Results", "No foods found matching your search.");
        setSearchResults([]);
        return;
      }

      const validResults = data.foods.filter((food) => {
        const hasEnergy = food.foodNutrients.some(
          (n) => n.nutrientName === "Energy" || n.nutrientId === 1008
        );
        const hasProtein = food.foodNutrients.some(
          (n) => n.nutrientName === "Protein" || n.nutrientId === 1003
        );
        return hasEnergy && hasProtein;
      });

      console.log("Setting search results:", validResults.length);
      setSearchResults(validResults);
    } catch (error) {
      console.error("Error searching USDA database:", error);
      Alert.alert(
        "Error",
        "There was a problem searching for foods. Please try again."
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleBarcodeScan = async (barcode) => {
    setShowBarcodeScanner(false);
    setIsSearching(true);
    try {
      const response = await fetch(
        `${USDA_API_ENDPOINT}/foods/search?api_key=${USDA_API_KEY}&query=${barcode}&dataType=Branded`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.foods || data.foods.length === 0) {
        Alert.alert("No Results", "No products found with this barcode.");
        setSearchResults([]);
        return;
      }

      setSearchResults(data.foods);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching by barcode:", error);
      Alert.alert("Error", "Failed to search. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFoodSelect = (food) => {
    console.log("Step 1 - Food selected in FoodScreen:", {
      food,
      currentShowNutritionModal: showNutritionModal,
    });
    setSelectedFood(food);
    setShowNutritionModal(true);
  };

  const handleAddFood = async (food, servings) => {
    console.log("Adding food with servings:", { food, servings });
    const success = await addMeal(food, servings);
    if (success) {
      handleCloseAll();
    }
  };

  const handleCloseAll = () => {
    setShowNutritionModal(false);
    setShowSearchResults(false);
    setSelectedFood(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSearchSubmit = () => {
    setShowSearchResults(true);
    searchFood();
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
          onSubmit={handleSearchSubmit}
          onScanPress={() => setShowBarcodeScanner(true)}
        />
        <MealsList meals={meals} onDelete={deleteMeal} />

        {showSearchResults && (
          <SearchResultsModal
            visible={showSearchResults}
            results={searchResults}
            isSearching={isSearching}
            onSelect={handleFoodSelect}
            onClose={() => {
              setShowSearchResults(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
          />
        )}

        {showNutritionModal && selectedFood && (
          <NutritionModal
            visible={showNutritionModal}
            food={selectedFood}
            onAdd={handleAddFood}
            onClose={() => {
              setShowNutritionModal(false);
              setSelectedFood(null);
            }}
          />
        )}

        <BarcodeScannerModal
          visible={showBarcodeScanner}
          onClose={() => setShowBarcodeScanner(false)}
          onScan={handleBarcodeScan}
        />

        {showGoalsModal && (
          <GoalsModal
            visible={showGoalsModal}
            dailyGoals={dailyGoals}
            onSave={setDailyGoals}
            onClose={() => setShowGoalsModal(false)}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}
