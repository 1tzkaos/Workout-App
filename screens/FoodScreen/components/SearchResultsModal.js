// SearchResultsModal.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getNutrientValue } from "../utils/nutrition";
import styles from "../styles";

export default function SearchResultsModal({
  visible,
  results,
  isSearching,
  onSelect,
  onClose,
}) {
  const handleSelect = (food) => {
    console.log("Step 0 - SearchResultsModal handleSelect:", food?.description);
    if (onSelect) {
      onSelect(food);
    }
  };

  if (!visible) return null;

  return (
    visible && (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "80%",
          backgroundColor: "#1E1E1E",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          zIndex: 1,
          padding: 20,
        }}
      >
        {/* Header */}
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsTitle}>Search Results</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeSearchButton}>
            <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Results List */}
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
          </View>
        ) : (
          <ScrollView>
            {results.map((food) => (
              <TouchableOpacity
                key={food.fdcId}
                style={styles.searchResultItem}
                onPress={() => handleSelect(food)}
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
                    C: {getNutrientValue(food, "Carbohydrate, by difference")}g
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
    )
  );
}
