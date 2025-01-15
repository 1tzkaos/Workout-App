// components/BarcodeScannerModal.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BarcodeScannerModal({ visible, onClose, onScan }) {
  const insets = useSafeAreaInsets();
  const [barcode, setBarcode] = useState("");

  const handleSubmit = () => {
    if (barcode.trim()) {
      Keyboard.dismiss();
      onScan(barcode.trim());
      setBarcode("");
    }
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    setBarcode("");
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      onRequestClose={handleCancel}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={handleCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalContent, { marginTop: insets.top }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Enter Barcode</Text>
                <TouchableOpacity onPress={handleCancel}>
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                value={barcode}
                onChangeText={setBarcode}
                placeholder="Enter barcode number"
                placeholderTextColor="#666666"
                keyboardType="number-pad"
                maxLength={13}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
                autoFocus
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>

              <Text style={styles.sampleText}>
                Sample barcodes:{"\n"}
                049000000443 - Coca-Cola{"\n"}
                038000138416 - Kellogg's{"\n"}
                011110038364 - Nature Valley
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    padding: 20,
    alignItems: "stretch",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sampleText: {
    color: "#666666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 20,
    lineHeight: 20,
  },
});
