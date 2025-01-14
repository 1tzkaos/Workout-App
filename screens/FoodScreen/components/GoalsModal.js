// src/screens/FoodScreen/components/GoalsModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function GoalsModal({ visible, dailyGoals, onSave, onClose }) {
  const [tempGoals, setTempGoals] = useState(dailyGoals);

  useEffect(() => {
    if (visible) {
      setTempGoals(dailyGoals);
    }
  }, [visible, dailyGoals]);

  const handleSave = () => {
    onSave(tempGoals);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Daily Goals</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Daily Calories</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tempGoals.calories.toString()}
              onChangeText={(val) =>
                setTempGoals({ ...tempGoals, calories: parseInt(val) || 0 })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tempGoals.protein.toString()}
              onChangeText={(val) =>
                setTempGoals({ ...tempGoals, protein: parseInt(val) || 0 })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tempGoals.carbs.toString()}
              onChangeText={(val) =>
                setTempGoals({ ...tempGoals, carbs: parseInt(val) || 0 })
              }
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fat (g)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={tempGoals.fat.toString()}
              onChangeText={(val) =>
                setTempGoals({ ...tempGoals, fat: parseInt(val) || 0 })
              }
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}





