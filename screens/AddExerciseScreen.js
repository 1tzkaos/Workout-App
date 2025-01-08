// screens/AddExerciseScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const POPULAR_EXERCISES = [
  "Bench Press",
  "Squat",
  "Deadlift",
  "Lat Pulldown",
  "Incline Dumbbell Press",
  "Leg Extension",
  "Incline Bench Press",
  "Pull-Up",
  "Dips",
  "Tricep Pushdown (Rope)",
  "Overhead Press",
  "Shoulder Press",
  "Leg Press",
  "Hammer Curls",
];

export default function AddExerciseScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [selectedExercises, setSelectedExercises] = useState(new Set());

  const toggleExercise = async (exercise) => {
    const newSelected = new Set(selectedExercises);
    if (newSelected.has(exercise)) {
      newSelected.delete(exercise);
    } else {
      newSelected.add(exercise);
    }
    setSelectedExercises(newSelected);
  };

  const saveExercises = async () => {
    try {
      const exercisesJson = await AsyncStorage.getItem("@exercises");
      let exercises = exercisesJson ? JSON.parse(exercisesJson) : [];

      // Add new exercises
      const newExercises = Array.from(selectedExercises).map((name) => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name,
      }));

      exercises = [...exercises, ...newExercises];
      await AsyncStorage.setItem("@exercises", JSON.stringify(exercises));
      navigation.goBack();
    } catch (error) {
      console.error("Error saving exercises:", error);
    }
  };

  const filteredExercises = POPULAR_EXERCISES.filter((exercise) =>
    exercise.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Exercises</Text>
        <TouchableOpacity onPress={saveExercises}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search or enter exercise name"
          placeholderTextColor="#8E8E93"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Popular Exercises List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>By Popularity</Text>
        <ScrollView>
          {filteredExercises.map((exercise) => (
            <TouchableOpacity
              key={exercise}
              style={styles.exerciseItem}
              onPress={() => toggleExercise(exercise)}
            >
              <View style={styles.exerciseLeftSection}>
                {selectedExercises.has(exercise) ? (
                  <MaterialCommunityIcons
                    name="check"
                    size={24}
                    color="#00FF00"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="plus"
                    size={24}
                    color="#00FF00"
                  />
                )}
                <Text style={styles.exerciseName}>{exercise}</Text>
              </View>
              <View style={styles.circleIndicator} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  doneButton: {
    color: "#00FF00",
    fontSize: 17,
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    margin: 16,
    padding: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    marginLeft: 8,
    padding: 8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#8E8E93",
    fontSize: 17,
    marginBottom: 16,
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#38383A",
  },
  exerciseLeftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseName: {
    color: "#FFFFFF",
    fontSize: 17,
    marginLeft: 12,
  },
  circleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#38383A",
  },
});
