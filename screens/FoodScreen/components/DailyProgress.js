// src/screens/FoodScreen/components/DailyProgress.js
import React from 'react';
import { View, Text } from 'react-native';
import MacroProgress from './MacroProgress';
import styles from '../styles';

export default function DailyProgress({ dailyGoals, todaysMacros }) {
  const remainingCalories = dailyGoals.calories - todaysMacros.calories;

  return (
    <View style={styles.calorieCard}>
      <Text style={styles.calorieTitle}>Calories Remaining</Text>
      <Text style={styles.calorieNumbers}>
        <Text style={styles.remainingCalories}>
          {remainingCalories}
        </Text>
        <Text style={styles.goalCalories}> / {dailyGoals.calories}</Text>
      </Text>

      <MacroProgress
        label="Protein"
        current={todaysMacros.protein}
        goal={dailyGoals.protein}
        color="#FF6B6B"
      />
      <MacroProgress
        label="Carbs"
        current={todaysMacros.carbs}
        goal={dailyGoals.carbs}
        color="#4ECDC4"
      />
      <MacroProgress
        label="Fat"
        current={todaysMacros.fat}
        goal={dailyGoals.fat}
        color="#FFD93D"
      />
    </View>
  );
}



