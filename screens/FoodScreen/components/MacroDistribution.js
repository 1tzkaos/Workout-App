// src/screens/FoodScreen/components/MacroDistribution.js
import React from "react";
import { View, Text } from "react-native";
import { getNutrientValue } from "../utils/nutrition";
import styles from "../styles";

export default function MacroDistribution({ food }) {
  // Calculate calories from each macro
  const protein = getNutrientValue(food, "Protein") * 4;
  const carbs = getNutrientValue(food, "Carbohydrate, by difference") * 4;
  const fat = getNutrientValue(food, "Total lipid (fat)") * 9;
  const totalCals = protein + carbs + fat;

  const getPercentage = (macroCalories) => {
    return totalCals > 0 ? (macroCalories / totalCals) * 100 : 0;
  };

  const proteinPercentage = getPercentage(protein);
  const carbsPercentage = getPercentage(carbs);
  const fatPercentage = getPercentage(fat);

  return (
    <View style={styles.macroDistributionContainer}>
      <Text style={styles.distributionTitle}>Calorie Distribution</Text>

      <View style={styles.distributionBar}>
        <View
          style={[
            styles.distributionSegment,
            {
              backgroundColor: "#FF6B6B",
              width: `${proteinPercentage}%`,
            },
          ]}
        />
        <View
          style={[
            styles.distributionSegment,
            {
              backgroundColor: "#4ECDC4",
              width: `${carbsPercentage}%`,
            },
          ]}
        />
        <View
          style={[
            styles.distributionSegment,
            {
              backgroundColor: "#FFD93D",
              width: `${fatPercentage}%`,
            },
          ]}
        />
      </View>

      <View style={styles.distributionLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#FF6B6B" }]} />
          <Text style={styles.legendText}>
            Protein {Math.round(proteinPercentage)}%
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#4ECDC4" }]} />
          <Text style={styles.legendText}>
            Carbs {Math.round(carbsPercentage)}%
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#FFD93D" }]} />
          <Text style={styles.legendText}>
            Fat {Math.round(fatPercentage)}%
          </Text>
        </View>
      </View>
    </View>
  );
}
