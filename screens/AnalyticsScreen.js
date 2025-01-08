// screens/AnalyticsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-chart-kit";
import PropTypes from "prop-types";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { exercise } = route.params;
  const [sets, setSets] = useState([]);
  const [weightData, setWeightData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [repsData, setRepsData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    loadSets();
  }, [exercise.name]);

  const loadSets = async () => {
    try {
      const setsJson = await AsyncStorage.getItem("@workout_sets");
      if (setsJson) {
        const allSets = JSON.parse(setsJson);
        const exerciseSets = allSets
          .filter((set) => set.exercise === exercise.name)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setSets(exerciseSets);

        // Process last 7 sets for the charts
        const recentSets = exerciseSets.slice(-7);

        const weightChartData = {
          labels: recentSets.map((set) =>
            new Date(set.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          ),
          datasets: [
            {
              data: recentSets.map((set) => set.weight),
            },
          ],
        };

        const repsChartData = {
          labels: recentSets.map((set) =>
            new Date(set.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          ),
          datasets: [
            {
              data: recentSets.map((set) => set.reps),
            },
          ],
        };

        setWeightData(weightChartData);
        setRepsData(repsChartData);
      }
    } catch (error) {
      console.error("Error loading sets:", error);
    }
  };

  const calculateStats = () => {
    if (sets.length === 0) return { max: 0, average: 0 };

    const maxWeight = Math.max(...sets.map((set) => set.weight));
    const avgWeight =
      sets.reduce((acc, set) => acc + set.weight, 0) / sets.length;

    return {
      max: maxWeight,
      average: Math.round(avgWeight * 10) / 10,
    };
  };

  const chartConfig = {
    backgroundGradientFrom: "#1C1C1E",
    backgroundGradientTo: "#1C1C1E",
    color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#00FF00",
    },
  };

  const repsChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#FFA500",
    },
  };

  const stats = calculateStats();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise.name} Analytics</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Max Weight</Text>
          <Text style={styles.statValue}>{stats.max} lb</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average Weight</Text>
          <Text style={styles.statValue}>{stats.average} lb</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Weight Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weight Progress</Text>
          {weightData.labels.length > 0 && (
            <LineChart
              data={weightData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </View>

        {/* Reps Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Reps Progress</Text>
          {repsData.labels.length > 0 && (
            <LineChart
              data={repsData}
              width={screenWidth - 64}
              height={220}
              chartConfig={repsChartConfig}
              bezier
              style={styles.chart}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

AnalyticsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      exercise: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
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
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 16,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
  },
  statLabel: {
    color: "#8E8E93",
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chartContainer: {
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  chartTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 10,
    marginVertical: 8,
  },
});
