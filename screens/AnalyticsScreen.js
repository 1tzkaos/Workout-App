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
import { ChevronIcon } from "./components/ChevronIcon";
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

  const stats = calculateStats();

  const chartConfig = {
    backgroundColor: "#1E1E1E",
    backgroundGradientFrom: "#1E1E1E",
    backgroundGradientTo: "#1E1E1E",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Blue color
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: "#2D2D2D",
    },
    propsForLabels: {
      fill: "#B3B3B3",
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#3498db",
    },
  };

  const repsChartConfig = {
    ...chartConfig,
    color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`, // Green color
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#2ecc71",
    },
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <ChevronIcon size={28} color="#3498db" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise.name} Analytics</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Max Weight</Text>
          <Text style={styles.statValue}>
            {stats.max}
            <Text style={styles.statUnit}> lb</Text>
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average Weight</Text>
          <Text style={styles.statValue}>
            {stats.average}
            <Text style={styles.statUnit}> lb</Text>
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Weight Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weight Progress</Text>
          <Text style={styles.chartSubtitle}>Last 7 sets</Text>
          {weightData.labels.length > 0 && (
            <LineChart
              data={weightData}
              width={screenWidth - 48}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={true}
            />
          )}
        </View>

        {/* Reps Progress Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Reps Progress</Text>
          <Text style={styles.chartSubtitle}>Last 7 sets</Text>
          {repsData.labels.length > 0 && (
            <LineChart
              data={repsData}
              width={screenWidth - 48}
              height={220}
              chartConfig={repsChartConfig}
              bezier
              style={styles.chart}
              withInnerLines={true}
              withOuterLines={true}
              withVerticalLines={false}
              withHorizontalLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={true}
            />
          )}
        </View>
      </ScrollView>
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
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    flex: 1,
    marginHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statLabel: {
    color: "#B3B3B3",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 8,
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  statUnit: {
    color: "#B3B3B3",
    fontSize: 20,
    fontWeight: "normal",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chartContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  chartSubtitle: {
    color: "#B3B3B3",
    fontSize: 14,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    color: "#B3B3B3",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 40,
  },
});

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
