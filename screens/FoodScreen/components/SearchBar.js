// src/screens/FoodScreen/components/SearchBar.js
import React from "react";
import { View, TextInput, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles";

export default function SearchBar({
  searchQuery,
  isSearching,
  onChangeText,
  onSubmit,
}) {
  return (
    <View style={styles.searchContainer}>
      <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" />
      <TextInput
        style={styles.searchInput}
        placeholder={isSearching ? "Searching..." : "Search foods..."}
        placeholderTextColor="#8E8E93"
        value={searchQuery}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        editable={!isSearching}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {isSearching && (
        <ActivityIndicator
          size="small"
          color="#3498db"
          style={{ marginLeft: 8 }}
        />
      )}
    </View>
  );
}
