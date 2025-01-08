import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import PropTypes from "prop-types";

export default function ExerciseDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { exercise } = route.params;
  const [sets, setSets] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadSets();
    }, [exercise.name])
  );

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

  // Update the groupSetsByDay function in ExerciseDetailScreen.js
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Exercises</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise.name}</Text>
        <TouchableOpacity>
          <Text style={styles.moreButton}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Analytics and 1RM Section */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionItem}>
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
            {daySets.map((set) => (
              <TouchableOpacity key={set.id} style={styles.setItem}>
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
              </TouchableOpacity>
            ))}
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
  );
}

// Add PropTypes validation
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
  quickActions: {
    backgroundColor: "#1C1C1E",
    margin: 16,
    borderRadius: 10,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#38383A",
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 17,
    flex: 1,
  },
  actionStatus: {
    color: "#8E8E93",
    fontSize: 17,
  },
  tipContainer: {
    backgroundColor: "#1C1C1E",
    margin: 16,
    padding: 16,
    borderRadius: 10,
  },
  tipTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
  },
  tipText: {
    color: "#8E8E93",
    fontSize: 15,
  },
  setsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dayHeader: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 8,
  },
  setItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1C1C1E",
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
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
    color: "#00FF00",
    fontSize: 17,
    marginRight: 16,
  },
  setWeight: {
    color: "#FFA500",
    fontSize: 17,
  },
  setLabel: {
    color: "#8E8E93",
    fontSize: 17,
  },
  addButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#00FF00",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 32,
    color: "#000000",
  },
});
