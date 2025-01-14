// src/screens/FoodScreen/components/Header.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../styles";

export default function Header({ onSettingsPress }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Food Log</Text>
      <TouchableOpacity onPress={onSettingsPress}>
        <MaterialCommunityIcons name="cog" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
