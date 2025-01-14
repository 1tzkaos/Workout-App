// src/screens/FoodScreen/components/NutritionModal.js
import React from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getNutrientValue } from "../utils/nutrition";
import MacroDistribution from "./MacroDistribution";
import styles from "../styles";

export default function NutritionModal({ visible, food, onAdd, onClose }) {
  if (!food) return null;

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
            <Text style={styles.servingSize}>
              Serving size: {food.servingSize || 100}g
            </Text>

            <View style={styles.nutritionDivider} />

            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>
                {getNutrientValue(food, "Energy")}
              </Text>
            </View>

            <MacroDistribution food={food} />

            <View style={styles.nutritionLargeDivider} />

            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Total Fat</Text>
              <Text style={styles.nutritionValue}>
                {getNutrientValue(food, "Total lipid (fat)")}g
              </Text>
            </View>

            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Total Carbohydrates</Text>
              <Text style={styles.nutritionValue}>
                {getNutrientValue(food, "Carbohydrate, by difference")}g
              </Text>
            </View>

            <View style={styles.nutritionSubItem}>
              <Text style={styles.nutritionSubLabel}>Dietary Fiber</Text>
              <Text style={styles.nutritionValue}>
                {getNutrientValue(food, "Fiber, total dietary")}g
              </Text>
            </View>

            <View style={styles.nutritionSubItem}>
              <Text style={styles.nutritionSubLabel}>Sugars</Text>
              <Text style={styles.nutritionValue}>
                {getNutrientValue(food, "Sugars, total")}g
              </Text>
            </View>

            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>
                {getNutrientValue(food, "Protein")}g
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.addFoodButton} onPress={onAdd}>
            <Text style={styles.addFoodButtonText}>Add Food</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
