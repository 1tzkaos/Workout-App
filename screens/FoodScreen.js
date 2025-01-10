// screens/FoodScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const USDA_API_KEY = "W2PkO4sB6D2ly6GrdQyoxsDdnkiPT9lNIEyUfsaT";
const USDA_API_ENDPOINT = "https://api.nal.usda.gov/fdc/v1";

export default function FoodScreen({ navigation }) {
  const insets = useSafeAreaInsets();
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [tempGoals, setTempGoals] = useState({ ...dailyGoals });
  const [selectedFood, setSelectedFood] = useState(null);
  const [showNutritionModal, setShowNutritionModal] = useState(false);

  // Load saved data when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      loadSavedData();
    }, [])
  );
  const getNutrientValue = (food, nutrientName) => {
    const nutrient = food.foodNutrients.find(
      (n) => n.nutrientName === nutrientName
    );
    return nutrient ? Math.round(nutrient.value * 10) / 10 : 0;
  };
  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setShowNutritionModal(true);
  };

  const handleAddFood = async () => {
    if (selectedFood) {
      await addMeal(selectedFood);
      setShowNutritionModal(false);
      setSelectedFood(null);
      setSearchResults([]);
    }
  };

  const loadSavedData = async () => {
    try {
      const savedGoals = await AsyncStorage.getItem("@daily_goals");
      const savedMeals = await AsyncStorage.getItem("@today_meals");

      if (savedGoals) {
        setDailyGoals(JSON.parse(savedGoals));
      }
      if (savedMeals) {
        const meals = JSON.parse(savedMeals);
        setMeals(meals);
        calculateTodaysMacros(meals);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
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

  const searchFood = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `${USDA_API_ENDPOINT}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();
      setSearchResults(data.foods || []);
    } catch (error) {
      console.error("Error searching USDA database:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const addMeal = async (food) => {
    const newMeal = {
      id: Date.now().toString(),
      name: food.description,
      calories:
        food.foodNutrients.find((n) => n.nutrientName === "Energy")?.value || 0,
      protein:
        food.foodNutrients.find((n) => n.nutrientName === "Protein")?.value ||
        0,
      carbs:
        food.foodNutrients.find(
          (n) => n.nutrientName === "Carbohydrate, by difference"
        )?.value || 0,
      fat:
        food.foodNutrients.find((n) => n.nutrientName === "Total lipid (fat)")
          ?.value || 0,
      servingSize: food.servingSize || 100,
      timestamp: new Date().toISOString(),
    };

    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    calculateTodaysMacros(updatedMeals);
    await AsyncStorage.setItem("@today_meals", JSON.stringify(updatedMeals));
  };

  const saveGoals = async () => {
    setDailyGoals(tempGoals);
    await AsyncStorage.setItem("@daily_goals", JSON.stringify(tempGoals));
    setShowGoalsModal(false);
  };

  const MacroProgress = ({ label, current, goal, color }) => (
    <View style={styles.macroProgressContainer}>
      <View style={styles.macroLabelContainer}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValues}>
          {current}/{goal}g
        </Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${Math.min((current / goal) * 100, 100)}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
  const NutritionModal = () => (
    <Modal
      visible={showNutritionModal}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.nutritionModalContainer}>
        <View style={styles.nutritionModalContent}>
          <View style={styles.nutritionModalHeader}>
            <Text style={styles.nutritionModalTitle}>Nutrition Facts</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowNutritionModal(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {selectedFood && (
            <>
              <Text style={styles.foodTitle}>{selectedFood.description}</Text>
              <Text style={styles.servingSize}>
                Serving size: {selectedFood.servingSize || 100}g
              </Text>

              <View style={styles.nutritionDivider} />

              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionValue}>
                  {getNutrientValue(selectedFood, "Energy")}
                </Text>
              </View>

              <View style={styles.nutritionLargeDivider} />

              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Total Fat</Text>
                <Text style={styles.nutritionValue}>
                  {getNutrientValue(selectedFood, "Total lipid (fat)")}g
                </Text>
              </View>

              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Total Carbohydrates</Text>
                <Text style={styles.nutritionValue}>
                  {getNutrientValue(
                    selectedFood,
                    "Carbohydrate, by difference"
                  )}
                  g
                </Text>
              </View>

              <View style={styles.nutritionSubItem}>
                <Text style={styles.nutritionSubLabel}>Dietary Fiber</Text>
                <Text style={styles.nutritionValue}>
                  {getNutrientValue(selectedFood, "Fiber, total dietary")}g
                </Text>
              </View>

              <View style={styles.nutritionSubItem}>
                <Text style={styles.nutritionSubLabel}>Sugars</Text>
                <Text style={styles.nutritionValue}>
                  {getNutrientValue(selectedFood, "Sugars, total")}g
                </Text>
              </View>

              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>
                  {getNutrientValue(selectedFood, "Protein")}g
                </Text>
              </View>

              <TouchableOpacity
                style={styles.addFoodButton}
                onPress={handleAddFood}
              >
                <Text style={styles.addFoodButtonText}>Add Food</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food Log</Text>
        <TouchableOpacity onPress={() => setShowGoalsModal(true)}>
          <MaterialCommunityIcons name="cog" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Daily Progress */}
      <View style={styles.calorieCard}>
        <Text style={styles.calorieTitle}>Calories Remaining</Text>
        <Text style={styles.calorieNumbers}>
          <Text style={styles.remainingCalories}>
            {dailyGoals.calories - todaysMacros.calories}
          </Text>
          <Text style={styles.goalCalories}> / {dailyGoals.calories}</Text>
        </Text>

        {/* Macro Progress Bars */}
        <MacroProgress
          label="Protein"
          current={todaysMacros.protein}
          goal={dailyGoals.protein}
          color="#FF6B6B"
        />
        <MacroProgress
          label="Carbs"
          current={todaysMacros.carbs}
          goal={dailyGoals.carbs}
          color="#4ECDC4"
        />
        <MacroProgress
          label="Fat"
          current={todaysMacros.fat}
          goal={dailyGoals.fat}
          color="#FFD93D"
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={searchFood}
        />
      </View>

      {/* Food List */}
      <ScrollView style={styles.mealsList}>
        {meals.map((meal) => (
          <View key={meal.id} style={styles.mealItem}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealMacros}>
              {meal.calories} cal • {meal.protein}p • {meal.carbs}c • {meal.fat}
              f
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Goals Modal */}
      <Modal visible={showGoalsModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Daily Goals</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Daily Calories</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={tempGoals.calories.toString()}
                onChangeText={(val) =>
                  setTempGoals({ ...tempGoals, calories: parseInt(val) || 0 })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={tempGoals.protein.toString()}
                onChangeText={(val) =>
                  setTempGoals({ ...tempGoals, protein: parseInt(val) || 0 })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={tempGoals.carbs.toString()}
                onChangeText={(val) =>
                  setTempGoals({ ...tempGoals, carbs: parseInt(val) || 0 })
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={tempGoals.fat.toString()}
                onChangeText={(val) =>
                  setTempGoals({ ...tempGoals, fat: parseInt(val) || 0 })
                }
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowGoalsModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveGoals}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Search Results Modal */}
      <Modal
        visible={isSearching || searchResults.length > 0}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.searchResultsContainer}>
          <View style={styles.searchResultsHeader}>
            <Text style={styles.searchResultsTitle}>Search Results</Text>
            <TouchableOpacity
              onPress={() => {
                setSearchResults([]);
                setSearchQuery("");
              }}
              style={styles.closeSearchButton}
            >
              <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3498db" />
            </View>
          ) : (
            <ScrollView>
              {searchResults.map((food) => (
                <TouchableOpacity
                  key={food.fdcId}
                  style={styles.searchResultItem}
                  onPress={() => handleFoodSelect(food)}
                >
                  <Text style={styles.foodName}>{food.description}</Text>
                  <View style={styles.macroRow}>
                    <Text style={styles.macroText}>
                      {getNutrientValue(food, "Energy")} cal
                    </Text>
                    <Text style={styles.macroDot}>•</Text>
                    <Text style={styles.macroText}>
                      P: {getNutrientValue(food, "Protein")}g
                    </Text>
                    <Text style={styles.macroDot}>•</Text>
                    <Text style={styles.macroText}>
                      C: {getNutrientValue(food, "Carbohydrate, by difference")}
                      g
                    </Text>
                    <Text style={styles.macroDot}>•</Text>
                    <Text style={styles.macroText}>
                      F: {getNutrientValue(food, "Total lipid (fat)")}g
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </Modal>

      {/* Nutrition Details Modal */}
      <Modal
        visible={showNutritionModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.nutritionModalContainer}>
          <View style={styles.nutritionModalContent}>
            <View style={styles.nutritionModalHeader}>
              <Text style={styles.nutritionModalTitle}>Nutrition Facts</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowNutritionModal(false)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            {selectedFood && (
              <>
                <Text style={styles.foodTitle}>{selectedFood.description}</Text>
                <Text style={styles.servingSize}>
                  Serving size: {selectedFood.servingSize || 100}g
                </Text>

                <View style={styles.nutritionDivider} />

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                  <Text style={styles.nutritionValue}>
                    {getNutrientValue(selectedFood, "Energy")}
                  </Text>
                </View>

                <View style={styles.nutritionLargeDivider} />

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Total Fat</Text>
                  <Text style={styles.nutritionValue}>
                    {getNutrientValue(selectedFood, "Total lipid (fat)")}g
                  </Text>
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Total Carbohydrates</Text>
                  <Text style={styles.nutritionValue}>
                    {getNutrientValue(
                      selectedFood,
                      "Carbohydrate, by difference"
                    )}
                    g
                  </Text>
                </View>

                <View style={styles.nutritionSubItem}>
                  <Text style={styles.nutritionSubLabel}>Dietary Fiber</Text>
                  <Text style={styles.nutritionValue}>
                    {getNutrientValue(selectedFood, "Fiber, total dietary")}g
                  </Text>
                </View>

                <View style={styles.nutritionSubItem}>
                  <Text style={styles.nutritionSubLabel}>Sugars</Text>
                  <Text style={styles.nutritionValue}>
                    {getNutrientValue(selectedFood, "Sugars, total")}g
                  </Text>
                </View>

                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                  <Text style={styles.nutritionValue}>
                    {getNutrientValue(selectedFood, "Protein")}g
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.addFoodButton}
                  onPress={handleAddFood}
                >
                  <Text style={styles.addFoodButtonText}>Add Food</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  nutritionModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  nutritionModalContent: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  nutritionModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  nutritionModalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  foodTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  servingSize: {
    color: "#8E8E93",
    fontSize: 16,
    marginBottom: 16,
  },
  nutritionDivider: {
    height: 1,
    backgroundColor: "#2D2D2D",
    marginVertical: 8,
  },
  nutritionLargeDivider: {
    height: 8,
    backgroundColor: "#2D2D2D",
    marginVertical: 12,
  },
  nutritionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  nutritionSubItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingLeft: 20,
  },
  nutritionLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  nutritionSubLabel: {
    color: "#B3B3B3",
    fontSize: 16,
  },
  nutritionValue: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  addFoodButton: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  addFoodButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  searchResultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  searchResultsTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeSearchButton: {
    padding: 4,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  macroText: {
    color: "#8E8E93",
    fontSize: 14,
  },
  macroDot: {
    color: "#8E8E93",
    fontSize: 14,
    marginHorizontal: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  calorieCard: {
    backgroundColor: "#1E1E1E",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calorieTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  calorieNumbers: {
    marginBottom: 20,
  },
  remainingCalories: {
    color: "#3498db",
    fontSize: 36,
    fontWeight: "bold",
  },
  goalCalories: {
    color: "#8E8E93",
    fontSize: 24,
  },
  macroProgressContainer: {
    marginVertical: 8,
  },
  macroLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  macroLabel: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  macroValues: {
    color: "#8E8E93",
    fontSize: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#2D2D2D",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    margin: 16,
    padding: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    marginLeft: 8,
    padding: 8,
  },
  mealsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mealItem: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  mealMacros: {
    color: "#8E8E93",
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#2C2C2E",
  },
  saveButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  searchResultsContainer: {
    flex: 1,
    marginTop: "50%",
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  searchResultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D2D",
  },
  foodName: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 4,
  },
  foodDetails: {
    color: "#8E8E93",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
