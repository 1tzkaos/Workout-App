

// src/screens/FoodScreen/hooks/useSearch.js
import { useState } from "react";
import { Alert } from "react-native";

const USDA_API_KEY = "W2PkO4sB6D2ly6GrdQyoxsDdnkiPT9lNIEyUfsaT";
const USDA_API_ENDPOINT = "https://api.nal.usda.gov/fdc/v1";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchFood = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search term");
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${USDA_API_ENDPOINT}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&pageSize=25`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
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

      // Update recent searches
      const updatedRecentSearches = [
        searchQuery,
        ...recentSearches.filter((search) => search !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updatedRecentSearches);

      // Filter out entries with missing crucial nutritional data
      const validResults = data.foods.filter((food) => {
        const hasEnergy = food.foodNutrients.some(
          (n) => n.nutrientName === "Energy"
        );
        const hasProtein = food.foodNutrients.some(
          (n) => n.nutrientName === "Protein"
        );
        return hasEnergy && hasProtein;
      });

      setSearchResults(validResults);
    } catch (error) {
      console.error("Error searching USDA database:", error);
      Alert.alert(
        "Error",
        "There was a problem searching for foods. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
    setSelectedFood(null);
  };

  const getRecentSearches = () => {
    return recentSearches;
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    selectedFood,
    recentSearches,
    setSearchQuery,
    searchFood,
    handleFoodSelect,
    clearSearch,
    getRecentSearches,
    clearRecentSearches,
  };
};
