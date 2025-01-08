import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import PropTypes from "prop-types";

const formatLastUsed = (dateString) => {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}m ago`;
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [exercises, setExercises] = useState([
    { id: "1", name: "Bench Press" },
    { id: "2", name: "Squat" },
    { id: "3", name: "Leg Press" },
    { id: "4", name: "Hammer Curls" },
  ]);

  // Load exercises when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadExercises();
    }, [])
  );

  const loadExercises = async () => {
    try {
      const exercisesJson = await AsyncStorage.getItem("@exercises");
      if (!exercisesJson) {
        // If no exercises exist in storage, save the default ones
        await AsyncStorage.setItem("@exercises", JSON.stringify(exercises));
      } else {
        setExercises(JSON.parse(exercisesJson));
      }
    } catch (error) {
      console.error("Error loading exercises:", error);
    }
  };

  const renderExercise = (exercise) => (
    <TouchableOpacity
      key={exercise.id}
      style={styles.exerciseItem}
      onPress={() =>
        navigation.navigate("ExerciseDetail", {
          exercise: {
            id: exercise.id,
            name: exercise.name,
          },
        })
      }
    >
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <Text style={styles.lastUsed}>{formatLastUsed(exercise.lastUsed)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exercises</Text>
      </View>

      {/* Quick Log Tip */}
      <View style={styles.tipContainer}>
        <Text style={styles.tipTitle}>Quickly Log a Set</Text>
        <Text style={styles.tipText}>
          Swipe right on an exercise to record.
        </Text>
      </View>

      {/* Exercise List */}
      <View style={styles.list}>
        {exercises.map((exercise) => renderExercise(exercise))}
      </View>

      {/* Add Exercise Button */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Exercises</Text>
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={[styles.tabText, styles.tabTextActive]}>Sets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>Sessions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>Today</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  tipContainer: {
    backgroundColor: "#1C1C1E",
    margin: 16,
    padding: 16,
    borderRadius: 10,
  },
  tipTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tipText: {
    color: "#8E8E93",
    fontSize: 16,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1C1C1E",
    marginVertical: 4,
    borderRadius: 10,
  },
  exerciseName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "500",
  },
  lastUsed: {
    color: "#8E8E93",
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "#1C1C1E",
    margin: 16,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "#00FF00",
    fontSize: 17,
    fontWeight: "500",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    paddingBottom: 34,
    borderTopWidth: 0.5,
    borderTopColor: "#38383A",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  tabText: {
    color: "#8E8E93",
    fontSize: 14,
  },
  tabTextActive: {
    color: "#00FF00",
  },
});
