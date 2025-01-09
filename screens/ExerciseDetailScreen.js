import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import PropTypes from "prop-types";
import { ChevronIcon } from "./components/ChevronIcon";

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

export default function ExerciseDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { exercise } = route.params;
  const [sets, setSets] = useState([]);
  const [lastUsed, setLastUsed] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      loadSets();
      loadLastUsed();
    }, [exercise.name])
  );

  const loadLastUsed = async () => {
    try {
      const exercisesJson = await AsyncStorage.getItem("@exercises");
      if (exercisesJson) {
        const exercises = JSON.parse(exercisesJson);
        const currentExercise = exercises.find(
          (ex) => ex.name === exercise.name
        );
        if (currentExercise?.lastUsed) {
          setLastUsed(currentExercise.lastUsed);
        }
      }
    } catch (error) {
      console.error("Error loading last used:", error);
    }
  };

  const loadSets = async () => {
    try {
      const setsJson = await AsyncStorage.getItem("@workout_sets");
      if (setsJson) {
        const allSets = JSON.parse(setsJson);
        const exerciseSets = allSets
          .filter((set) => set.exercise === exercise.name)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        setSets(exerciseSets);
      }
    } catch (error) {
      console.error("Error loading sets:", error);
    }
  };

  const deleteSet = async (setId) => {
    try {
      const setsJson = await AsyncStorage.getItem("@workout_sets");
      if (setsJson) {
        const allSets = JSON.parse(setsJson);
        const updatedSets = allSets.filter((set) => set.id !== setId);
        await AsyncStorage.setItem(
          "@workout_sets",
          JSON.stringify(updatedSets)
        );

        // Update local state
        setSets((prevSets) => prevSets.filter((set) => set.id !== setId));

        // Update last used timestamp
        const newDate = new Date().toISOString();
        await updateLastUsed(newDate);
        setLastUsed(newDate);
      }
    } catch (error) {
      console.error("Error deleting set:", error);
    }
  };

  const updateLastUsed = async (dateString) => {
    try {
      const exercisesJson = await AsyncStorage.getItem("@exercises");
      if (exercisesJson) {
        const exercises = JSON.parse(exercisesJson);
        const updatedExercises = exercises.map((ex) => {
          if (ex.name === exercise.name) {
            return {
              ...ex,
              lastUsed: dateString,
            };
          }
          return ex;
        });
        await AsyncStorage.setItem(
          "@exercises",
          JSON.stringify(updatedExercises)
        );
      }
    } catch (error) {
      console.error("Error updating last used:", error);
    }
  };

  const renderRightActions = (progress, dragX, setId) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.deleteContainer,
          {
            opacity: opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteSet(setId)}
        >
          <Animated.Text
            style={[
              styles.deleteButtonText,
              {
                transform: [{ scale }],
              },
            ]}
          >
            Delete
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderSet = (set) => {
    let row = [];
    let prevOpenedRow;

    const closeRow = (index) => {
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };

    return (
      <Swipeable
        key={set.id} // Add the key prop here
        ref={(ref) => (row[set.id] = ref)}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, set.id)
        }
        onSwipeableOpen={() => closeRow(set.id)}
        overshootRight={false}
        rightThreshold={40}
        friction={2}
        useNativeAnimations
      >
        <View style={styles.setItem}>
          <Text style={styles.setTime}>{set.time}</Text>
          <View style={styles.setDetails}>
            <Text style={styles.setReps}>
              {set.reps}
              <Text style={styles.setLabel}> rep</Text>
            </Text>
            <Text style={styles.setWeight}>
              {set.weight}
              <Text style={styles.setLabel}> lb</Text>
            </Text>
          </View>
        </View>
      </Swipeable>
    );
  };

  const groupSetsByDay = () => {
    const grouped = {};
    sets.forEach((set) => {
      const date = new Date(set.date);
      const day = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push({
        ...set,
        time: date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      });
    });
    return grouped;
  };

  const groupedSets = groupSetsByDay();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => navigation.goBack()}
          >
            <ChevronIcon size={28} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{exercise.name}</Text>
          <TouchableOpacity>
            <Text style={styles.moreButton}>•••</Text>
          </TouchableOpacity>
        </View>

        {/* Last Used */}
        {lastUsed && (
          <Text style={styles.lastUsed}>
            Last used: {formatLastUsed(lastUsed)}
          </Text>
        )}

        {/* Analytics and 1RM Section */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() =>
              navigation.navigate("Analytics", {
                exercise: { name: exercise.name },
              })
            }
          >
            <Text style={styles.actionIcon}>📈</Text>
            <Text style={styles.actionText}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionText}>1RM</Text>
            <Text style={styles.actionStatus}>Off</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Tip */}
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>Repeat Sets Instantly</Text>
          <Text style={styles.tipText}>
            Swipe right to record the same set again.
          </Text>
        </View>

        {/* Sets List */}
        <ScrollView style={styles.setsContainer}>
          {Object.entries(groupedSets).map(([day, daySets]) => (
            <View key={day}>
              <Text style={styles.dayHeader}>{day}</Text>
              {daySets.map((set) => renderSet(set))}
            </View>
          ))}
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() =>
            navigation.navigate("AddSet", { exerciseName: exercise.name })
          }
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

ExerciseDetailScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      exercise: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
};

// Update these styles in ExerciseDetailScreen.js

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
    marginLeft: -28,
  },
  moreButton: {
    color: "#B3B3B3",
    fontSize: 20,
  },
  lastUsed: {
    color: "#B3B3B3",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 12,
  },
  quickActions: {
    backgroundColor: "#1E1E1E",
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D2D",
  },
  actionIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 17,
    flex: 1,
    fontWeight: "500",
  },
  actionStatus: {
    color: "#B3B3B3",
    fontSize: 17,
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
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
  tipText: {
    color: "#B3B3B3",
    fontSize: 15,
    lineHeight: 20,
  },
  setsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dayHeader: {
    color: "#B3B3B3",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 4,
  },
  setItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    padding: 20,
    borderRadius: 16,
    marginBottom: 10,
  },
  setTime: {
    color: "#FFFFFF",
    fontSize: 17,
  },
  setDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  setReps: {
    color: "#2ecc71",
    fontSize: 17,
    fontWeight: "600",
    marginRight: 16,
  },
  setWeight: {
    color: "#e67e22",
    fontSize: 17,
    fontWeight: "600",
  },
  setLabel: {
    color: "#B3B3B3",
    fontSize: 17,
  },
  deleteContainer: {
    marginBottom: 10,
    borderRadius: 16,
    overflow: "hidden",
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: "100%",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },
  addButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 34,
    includeFontPadding: false,
  },
});
