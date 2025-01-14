// src/screens/FoodScreen/components/MacroProgress.js
import React from "react";
import { View, Text } from "react-native";
import styles from "../styles";

export default function MacroProgress({ label, current, goal, color }) {
  return (
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
}
