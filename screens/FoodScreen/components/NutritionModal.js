// NutritionModal.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getNutrientValue } from "../utils/nutrition";
import MacroDistribution from "./MacroDistribution";
import styles from "../styles";

export default function NutritionModal({ visible, food, onAdd, onClose }) {
  console.log("Step 3 - NutritionModal props:", {
    visible,
    hasFood: !!food,
    foodDescription: food?.description,
  });

  const [servings, setServings] = useState(1);
  const [isEditingServings, setIsEditingServings] = useState(false);
  const [tempServings, setTempServings] = useState("1");

  useEffect(() => {
    console.log("Step 4 - NutritionModal useEffect triggered:", {
      visible,
      hasFood: !!food,
    });

    if (visible && food) {
      setServings(1);
      setTempServings("1");
      setIsEditingServings(false);
    }
  }, [visible, food]);

  if (!visible || !food) {
    console.log("Step 5 - NutritionModal returning null due to:", {
      visible,
      hasFood: !!food,
    });
    return null;
  }

  const handleAddFood = () => {
    console.log("Adding food with servings:", servings);
    onAdd(food, servings);
  };

  const adjustServings = (increment) => {
    setServings((prev) => {
      const newValue = Math.max(0.001, prev + increment);
      setTempServings(formatServingsDisplay(newValue));
      return newValue;
    });
  };

  const handleServingsSubmit = () => {
    const newValue = parseFloat(tempServings);
    if (!isNaN(newValue) && newValue > 0) {
      const roundedValue = Math.min(
        999.999,
        Math.max(0.001, parseFloat(newValue.toFixed(3)))
      );
      setServings(roundedValue);
      setTempServings(formatServingsDisplay(roundedValue));
    } else {
      setTempServings(formatServingsDisplay(servings));
    }
    setIsEditingServings(false);
  };

  const formatServingsDisplay = (value) => {
    if (Number.isInteger(value)) {
      return value.toString();
    }
    const strValue = value.toString();
    const [whole, decimal] = strValue.split(".");
    if (!decimal) return whole;
    const trimmedDecimal = decimal.replace(/0+$/, "");
    return trimmedDecimal.length === 0 ? whole : `${whole}.${trimmedDecimal}`;
  };

  const getAdjustedNutrientValue = (nutrientName) => {
    return (getNutrientValue(food, nutrientName) * servings).toFixed(1);
  };

  return (
    visible && (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ width: "100%", alignItems: "center" }}
        >
          <View
            style={[
              styles.nutritionModalContent,
              {
                backgroundColor: "#1E1E1E",
                borderRadius: 16,
                padding: 20,
                width: "90%",
                maxWidth: 400,
                maxHeight: "80%",
              },
            ]}
          >
            <View style={styles.nutritionModalHeader}>
              <Text style={styles.nutritionModalTitle}>Nutrition Facts</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.foodTitle}>{food.description}</Text>

              <View style={styles.servingSizeContainer}>
                <Text style={styles.servingSizeLabel}>
                  Serving size: {(food.servingSize || 100).toFixed(1)}g
                </Text>
                <View style={styles.servingsControl}>
                  <TouchableOpacity
                    style={styles.servingButton}
                    onPress={() => adjustServings(-0.5)}
                  >
                    <Text style={styles.servingButtonText}>-</Text>
                  </TouchableOpacity>

                  <View style={styles.servingsDisplay}>
                    {isEditingServings ? (
                      <TextInput
                        style={styles.servingsInput}
                        value={tempServings}
                        onChangeText={setTempServings}
                        keyboardType="decimal-pad"
                        autoFocus
                        selectTextOnFocus
                        onBlur={handleServingsSubmit}
                        onSubmitEditing={handleServingsSubmit}
                      />
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          setIsEditingServings(true);
                          setTempServings(formatServingsDisplay(servings));
                        }}
                      >
                        <Text style={styles.servingsValue}>
                          {formatServingsDisplay(servings)}
                        </Text>
                      </TouchableOpacity>
                    )}
                    <Text style={styles.servingsLabel}>servings</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.servingButton}
                    onPress={() => adjustServings(0.5)}
                  >
                    <Text style={styles.servingButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.nutritionDivider} />

              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionValue}>
                  {getAdjustedNutrientValue("Energy")}
                </Text>
              </View>

              <MacroDistribution food={food} servings={servings} />

              <View style={styles.nutritionLargeDivider} />

              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Total Fat</Text>
                <Text style={styles.nutritionValue}>
                  {getAdjustedNutrientValue("Total lipid (fat)")}g
                </Text>
              </View>

              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Total Carbohydrates</Text>
                <Text style={styles.nutritionValue}>
                  {getAdjustedNutrientValue("Carbohydrate, by difference")}g
                </Text>
              </View>

              <View style={styles.nutritionSubItem}>
                <Text style={styles.nutritionSubLabel}>Dietary Fiber</Text>
                <Text style={styles.nutritionValue}>
                  {getAdjustedNutrientValue("Fiber, total dietary")}g
                </Text>
              </View>

              <View style={styles.nutritionSubItem}>
                <Text style={styles.nutritionSubLabel}>Sugars</Text>
                <Text style={styles.nutritionValue}>
                  {getAdjustedNutrientValue("Sugars, total")}g
                </Text>
              </View>

              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>
                  {getAdjustedNutrientValue("Protein")}g
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.addFoodButton}
              onPress={handleAddFood}
            >
              <Text style={styles.addFoodButtonText}>Add Food</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    )
  );
}
