//useSearch.js
import { useState } from "react";
import { Alert } from "react-native";

const USDA_API_KEY = "W2PkO4sB6D2ly6GrdQyoxsDdnkiPT9lNIEyUfsaT";
const USDA_API_ENDPOINT = "https://api.nal.usda.gov/fdc/v1";

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

  const searchFood = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a search term");
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

      // Filter and process the results
      const validResults = data.foods.filter((food) => {
        const hasEnergy = food.foodNutrients.some(
          (n) => n.nutrientName === "Energy" || n.nutrientId === 1008
        );
        const hasProtein = food.foodNutrients.some(
          (n) => n.nutrientName === "Protein" || n.nutrientId === 1003
        );
        return hasEnergy && hasProtein;
      });

      console.log("Processed results:", validResults.length);
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

  const searchByBarcode = async (barcode) => {
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
        return;
      }

      setSearchResults(data.foods);
      setShowScanner(false);
    } catch (error) {
      console.error("Error searching by barcode:", error);
      Alert.alert(
        "Error",
        "No products found with this barcode. Try searching by name instead."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleFoodSelect = (food) => {
    console.log("Food selected:", food);
    setSelectedFood(food);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setSearchQuery("");
    setSelectedFood(null);
  };

  return {
    searchQuery,
    searchResults,
    isSearching,
    selectedFood,
    showScanner,
    setSearchQuery,
    setSearchResults,
    searchFood,
    searchByBarcode,
    handleFoodSelect,
    clearSearch,
    setSelectedFood,
    setShowScanner,
  };
};
