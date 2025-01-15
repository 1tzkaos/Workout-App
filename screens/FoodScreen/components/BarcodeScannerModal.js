// src/screens/FoodScreen/components/BarcodeScannerModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function BarcodeScannerModal({ visible, onClose, onScan }) {
  const [mockBarcode, setMockBarcode] = useState("");

  useEffect(() => {
    if (visible) {
      setMockBarcode("");
    }
  }, [visible]);

  const handleMockSubmit = () => {
    if (mockBarcode.trim()) {
      onScan(mockBarcode.trim());
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Scan Barcode</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Enter a barcode number for testing
          </Text>

          <TextInput
            style={styles.mockInput}
            value={mockBarcode}
            onChangeText={setMockBarcode}
            placeholder="Enter barcode number"
            placeholderTextColor="#666"
            keyboardType="number-pad"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleMockSubmit}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleMockSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.simulatorNote}>
            Sample barcodes for testing:{"\n"}
            049000000443 (Coca-Cola){"\n"}
            038000138416 (Kellogg's Corn Flakes){"\n"}
            011110038364 (Nature Valley)
          </Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalSubtitle: {
    color: "#B3B3B3",
    fontSize: 16,
    marginBottom: 20,
  },
  mockInput: {
    width: "100%",
    backgroundColor: "#2C2C2E",
    borderRadius: 10,
    padding: 15,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#2C2C2E",
  },
  submitButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  simulatorNote: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 20,
  },
});
