// screens/FoodScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ChevronIcon } from "./components/ChevronIcon";
import PropTypes from "prop-types";

export default function FoodScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.navigate("Home")}
        >
          <ChevronIcon size={28} color="#3498db" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Food Log</Text>

        <TouchableOpacity style={styles.moreButton}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Placeholder Content */}
      <View style={styles.contentContainer}>
        <MaterialCommunityIcons
          name="food-apple"
          size={48}
          color="#3498db"
          style={styles.placeholderIcon}
        />
        <Text style={styles.placeholderText}>Food tracking coming soon</Text>
        <Text style={styles.placeholderSubtext}>
          Track your meals and monitor your nutrition
        </Text>
      </View>
    </View>
  );
}

FoodScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    color: "#3498db",
    fontSize: 17,
    marginLeft: 4,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginLeft: -28, // Offset to center the title accounting for back button
  },
  moreButton: {
    width: 28, // Match the width of the back button for balance
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderIcon: {
    marginBottom: 16,
  },
  placeholderText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: "#B3B3B3",
    fontSize: 16,
    textAlign: "center",
  },
});
