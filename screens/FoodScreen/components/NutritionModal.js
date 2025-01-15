// src/screens/FoodScreen/components/NutritionModal.js
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
  const [servings, setServings] = useState(1);
  const [isEditingServings, setIsEditingServings] = useState(false);
  const [tempServings, setTempServings] = useState("1");

  useEffect(() => {
    if (visible) {
      setServings(1);
      setTempServings("1");
      setIsEditingServings(false);
    }
  }, [visible]);

  if (!food) return null;

  const handleAddFood = () => {
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
      // Round to 3 decimal places if more are entered
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

    // Convert to string and remove trailing zeros
    const strValue = value.toString();
    const [whole, decimal] = strValue.split(".");

    if (!decimal) return whole;

    // Trim trailing zeros from decimal part
    const trimmedDecimal = decimal.replace(/0+$/, "");

    if (trimmedDecimal.length === 0) {
      return whole;
    }

    return `${whole}.${trimmedDecimal}`;
  };

  const getAdjustedNutrientValue = (nutrientName) => {
    return (getNutrientValue(food, nutrientName) * servings).toFixed(1);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.nutritionModalContainer}
      >
        <View style={styles.nutritionModalContent}>
          <View style={styles.nutritionModalHeader}>
            <Text style={styles.nutritionModalTitle}>Nutrition Facts</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
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
                  onPress={() => adjustServings(-1)}
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
                  onPress={() => adjustServings(1)}
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
    </Modal>
  );
}
