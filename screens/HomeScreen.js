// screens/HomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";

const formatLastUsed = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}m ago`;
};

const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log("Storage successfully cleared!");
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

const clearSpecificData = async (keys = ["@exercises", "@workout_sets"]) => {
  try {
    await AsyncStorage.multiRemove(keys);
    console.log("Specific keys successfully cleared:", keys);
  } catch (error) {
    console.error("Error clearing specific keys:", error);
  }
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [exercises, setExercises] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadExercises();
    }, [])
  );

  const loadExercises = async () => {
    try {
      const exercisesJson = await AsyncStorage.getItem("@exercises");
      if (!exercisesJson) {
        // If no exercises exist in storage, initialize with defaults
        const defaultExercises = [{ id: "1", name: "Bench Press" }];
        await AsyncStorage.setItem(
          "@exercises",
          JSON.stringify(defaultExercises)
        );
        setExercises(defaultExercises);
      } else {
        let loadedExercises = JSON.parse(exercisesJson);

        // Remove duplicates based on exercise name
        const uniqueExercises = [];
        const seenNames = new Set();

        loadedExercises.forEach((exercise) => {
          if (!seenNames.has(exercise.name.toLowerCase())) {
            seenNames.add(exercise.name.toLowerCase());
            uniqueExercises.push(exercise);
          }
        });

        // If we removed any duplicates, update storage
        if (uniqueExercises.length !== loadedExercises.length) {
          await AsyncStorage.setItem(
            "@exercises",
            JSON.stringify(uniqueExercises)
          );
        }

        // Sort exercises alphabetically
        uniqueExercises.sort((a, b) => a.name.localeCompare(b.name));

        setExercises(uniqueExercises);
      }
    } catch (error) {
      console.error("Error loading exercises:", error);
    }
  };

  const handleLongPress = () => {
    Alert.alert(
      "Clear Data",
      "What would you like to clear?",
      [
        {
          text: "Clear All Data",
          onPress: async () => {
            await clearAllData();
            loadExercises();
          },
          style: "destructive",
        },
        {
          text: "Clear Exercise Data",
          onPress: async () => {
            await clearSpecificData(["@exercises"]);
            loadExercises();
          },
          style: "destructive",
        },
        {
          text: "Clear Workout Sets",
          onPress: async () => {
            await clearSpecificData(["@workout_sets"]);
          },
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exercises</Text>
        <TouchableOpacity onPress={handleLongPress}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Quick Log Tip */}
      <View style={styles.tipContainer}>
        <Text style={styles.tipTitle}>Quickly Log a Set</Text>
        <Text style={styles.tipText}>
          Swipe right on an exercise to record.
        </Text>
      </View>

      {/* Exercise List Container */}
      <View style={styles.mainContainer}>
        {/* Scrollable Exercise List */}
        <ScrollView
          style={styles.listContainer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={true}
          alwaysBounceVertical={false}
        >
          {exercises.map((exercise) => (
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
              <Text style={styles.lastUsed}>
                {exercise.lastUsed ? formatLastUsed(exercise.lastUsed) : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Add Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddExercise")}
          >
            <Text style={styles.addButtonText}>+ Add Exercises</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  tipContainer: {
    backgroundColor: "#1E1E1E",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tipTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  tipText: {
    color: "#B3B3B3",
    fontSize: 16,
    lineHeight: 22,
  },
  mainContainer: {
    flex: 1,
    marginBottom: 16, // Add bottom margin to account for tab bar
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 16,
  },
  exerciseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1E1E1E",
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  exerciseName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  lastUsed: {
    color: "#3498db",
    fontSize: 15,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#121212",
  },
  addButton: {
    backgroundColor: "#1E1E1E",
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3498db",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: "#3498db",
    fontSize: 17,
    fontWeight: "600",
  },
});
