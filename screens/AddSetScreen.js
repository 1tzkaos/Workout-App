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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    color: "#00FF00",
    fontSize: 17,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  moreButton: {
    color: "#FFFFFF",
    fontSize: 17,
  },
  inputContainer: {
    padding: 16,
  },
  inputLabel: {
    color: "#8E8E93",
    fontSize: 13,
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: "row",
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    marginBottom: 16,
    padding: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFA500",
  },
  valueContainerInactive: {
    borderColor: "transparent",
  },
  incrementButton: {
    padding: 8,
    width: 44,
    alignItems: "center",
  },
  incrementButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
  },
  valueDisplay: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  valueText: {
    color: "#FFFFFF",
    fontSize: 24,
    marginRight: 8,
  },
  unitText: {
    color: "#8E8E93",
    fontSize: 24,
  },
  recordButton: {
    backgroundColor: "#00FF00",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 16,
  },
  recordButtonText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "bold",
  },
  numPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    marginTop: "auto",
  },
  numButton: {
    width: "33.33%",
    aspectRatio: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  numButtonText: {
    color: "#FFFFFF",
    fontSize: 24,
  },
});
