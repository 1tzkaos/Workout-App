// screens/AddSetScreen.js
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

  // Update the saveSet function in AddSetScreen.js
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
    } catch (error) {
      console.error("Error saving set:", error);
    }
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

// Update these styles in AddSetScreen.js

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
