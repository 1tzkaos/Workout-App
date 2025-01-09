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
import PropTypes from "prop-types";

export default function AddSetScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { exerciseName } = route.params;
  const [reps, setReps] = useState("2");
  const [weight, setWeight] = useState("235");
  const [activeInput, setActiveInput] = useState("weight"); // 'weight' or 'reps'

  const updateValue = (num) => {
    if (activeInput === "weight") {
      setWeight((current) => (current === "0" ? num : current + num));
    } else {
      setReps((current) => (current === "0" ? num : current + num));
    }
  };

  const backspace = () => {
    if (activeInput === "weight") {
      setWeight((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
    } else {
      setReps((current) => (current.length > 1 ? current.slice(0, -1) : "0"));
    }
  };

  const incrementValue = (amount) => {
    if (activeInput === "weight") {
      setWeight((current) => (parseFloat(current) + amount).toString());
    } else {
      setReps((current) => (parseInt(current) + amount).toString());
    }
  };

  const checkForDuplicateSet = (sets, newSet) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000); // 5 minutes in milliseconds

    return sets.some(
      (set) =>
        set.exercise === newSet.exercise &&
        set.reps === newSet.reps &&
        set.weight === newSet.weight &&
        new Date(set.date) > fiveMinutesAgo // Only check sets from last 5 minutes
    );
  };

  const saveSet = async () => {
    try {
      // Save the new set
      const setsJson = await AsyncStorage.getItem("@workout_sets");
      const sets = setsJson ? JSON.parse(setsJson) : [];

      const newSet = {
        id: Date.now().toString(),
        exercise: exerciseName,
        reps: parseInt(reps),
        weight: parseFloat(weight),
        date: new Date().toISOString(),
      };

      // Check for duplicate sets
      if (checkForDuplicateSet(sets, newSet)) {
        Alert.alert(
          "Duplicate Set",
          "This exact set was already recorded in the last 5 minutes. Do you want to record it anyway?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Record Anyway",
              onPress: () => finalizeSave(sets, newSet),
            },
          ]
        );
        return;
      }

      await finalizeSave(sets, newSet);
    } catch (error) {
      console.error("Error saving set:", error);
    }
  };

  const finalizeSave = async (sets, newSet) => {
    // Add the new set
    sets.push(newSet);
    await AsyncStorage.setItem("@workout_sets", JSON.stringify(sets));

    // Update the exercise's lastUsed timestamp
    const exercisesJson = await AsyncStorage.getItem("@exercises");
    if (exercisesJson) {
      const exercises = JSON.parse(exercisesJson);
      const updatedExercises = exercises.map((ex) => {
        if (ex.name === exerciseName) {
          return {
            ...ex,
            lastUsed: new Date().toISOString(),
          };
        }
        return ex;
      });
      await AsyncStorage.setItem(
        "@exercises",
        JSON.stringify(updatedExercises)
      );
    }

    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Exercises</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exerciseName}</Text>
        <TouchableOpacity>
          <Text style={styles.moreButton}>•••</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} bounces={false}>
        {/* Weight and Reps Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>WEIGHT</Text>

          <TouchableOpacity
            style={[
              styles.valueContainer,
              activeInput === "reps" && styles.valueContainerInactive,
            ]}
            onPress={() => setActiveInput("weight")}
          >
            <TouchableOpacity
              onPress={() => incrementValue(-1)}
              style={styles.incrementButton}
            >
              <Text style={styles.incrementButtonText}>-</Text>
            </TouchableOpacity>

            <View style={styles.valueDisplay}>
              <Text style={styles.valueText}>{weight}</Text>
              <Text style={styles.unitText}>lb</Text>
            </View>

            <TouchableOpacity
              onPress={() => incrementValue(1)}
              style={styles.incrementButton}
            >
              <Text style={styles.incrementButtonText}>+</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Reps Input */}
          <Text style={styles.inputLabel}>REPS</Text>
          <TouchableOpacity
            style={[
              styles.valueContainer,
              activeInput === "weight" && styles.valueContainerInactive,
            ]}
            onPress={() => setActiveInput("reps")}
          >
            <TouchableOpacity
              onPress={() => incrementValue(-1)}
              style={styles.incrementButton}
            >
              <Text style={styles.incrementButtonText}>-</Text>
            </TouchableOpacity>

            <View style={styles.valueDisplay}>
              <Text style={styles.valueText}>{reps}</Text>
              <Text style={styles.unitText}>rep</Text>
            </View>

            <TouchableOpacity
              onPress={() => incrementValue(1)}
              style={styles.incrementButton}
            >
              <Text style={styles.incrementButtonText}>+</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Record Button */}
          <TouchableOpacity style={styles.recordButton} onPress={saveSet}>
            <Text style={styles.recordButtonText}>Record Set</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Number Pad */}
      <View style={styles.numPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0].map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.numButton}
            onPress={() => updateValue(num.toString())}
          >
            <Text style={styles.numButtonText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.numButton} onPress={backspace}>
          <Text style={styles.numButtonText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

AddSetScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      exerciseName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
  },
  backButton: {
    color: "#3498db",
    fontSize: 17,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  moreButton: {
    color: "#B3B3B3",
    fontSize: 20,
  },
  inputContainer: {
    padding: 20,
  },
  inputLabel: {
    color: "#B3B3B3",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  valueContainer: {
    flexDirection: "row",
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginBottom: 24,
    padding: 12,
    alignItems: "center",
    borderWidth: 2,
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
  valueContainerInactive: {
    borderColor: "transparent",
  },
  incrementButton: {
    padding: 12,
    width: 48,
    alignItems: "center",
  },
  incrementButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
  },
  valueDisplay: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  valueText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "600",
    marginRight: 8,
  },
  unitText: {
    color: "#B3B3B3",
    fontSize: 24,
  },
  recordButton: {
    backgroundColor: "#3498db",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recordButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  numPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    marginTop: "auto",
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
  },
  numButton: {
    width: "33.33%",
    aspectRatio: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  numButtonText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "500",
  },
});
