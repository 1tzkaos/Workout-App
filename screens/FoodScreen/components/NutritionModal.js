// src/screens/FoodScreen/components/NutritionModal.js
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getNutrientValue } from "../utils/nutrition";
import MacroDistribution from "./MacroDistribution";
import styles from "../styles";

export default function NutritionModal({ visible, food, onAdd, onClose }) {
  const [servings, setServings] = useState(1);

  if (!food) return null;

  const handleAddFood = () => {
    onAdd(food, servings);
  };

  const adjustServings = (increment) => {
    setServings((prev) => Math.max(1, +(prev + increment).toFixed(1)));
  };

  const getAdjustedNutrientValue = (nutrientName) => {
    return (getNutrientValue(food, nutrientName) * servings).toFixed(1);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.nutritionModalContainer}>
        <View style={styles.nutritionModalContent}>
          <View style={styles.nutritionModalHeader}>
            <Text style={styles.nutritionModalTitle}>Nutrition Facts</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.foodTitle}>{food.description}</Text>

            {/* Serving Size Controls */}
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
                  <Text style={styles.servingsValue}>
                    {servings.toFixed(1)}
                  </Text>
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
      </View>
    </Modal>
  );
}
