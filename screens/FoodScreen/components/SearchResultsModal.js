// src/screens/FoodScreen/components/SearchResultsModal.js
import React from "react";
import {
  View,
  Text,
  Modal,
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
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.searchResultsContainer}>
        <View style={styles.searchResultsHeader}>
          <Text style={styles.searchResultsTitle}>Search Results</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeSearchButton}>
            <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

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
                onPress={() => onSelect(food)}
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
    </Modal>
  );
}
