// src/screens/FoodScreen/styles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
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
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  calorieCard: {
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
  calorieTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  calorieNumbers: {
    marginBottom: 20,
  },
  remainingCalories: {
    color: "#3498db",
    fontSize: 36,
    fontWeight: "bold",
  },
  goalCalories: {
    color: "#8E8E93",
    fontSize: 24,
  },
  macroProgressContainer: {
    marginVertical: 8,
  },
  macroLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  macroLabel: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  macroValues: {
    color: "#8E8E93",
    fontSize: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#2D2D2D",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C2C2E",
    margin: 16,
    padding: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 17,
    marginLeft: 8,
    padding: 8,
  },
  mealsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  mealItem: {
    backgroundColor: "#1E1E1E",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  mealName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },
  mealMacros: {
    color: "#8E8E93",
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2C2C2E",
    borderRadius: 8,
    padding: 12,
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#2C2C2E",
  },
  saveButton: {
    backgroundColor: "#3498db",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  searchResultsContainer: {
    flex: 1,
    marginTop: "50%",
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  searchResultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  searchResultsTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeSearchButton: {
    padding: 4,
  },
  searchResultItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2D2D2D",
  },
  foodName: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 4,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
  },
  macroText: {
    color: "#8E8E93",
    fontSize: 14,
  },
  macroDot: {
    color: "#8E8E93",
    fontSize: 14,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Nutrition Modal Styles
  nutritionModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  nutritionModalContent: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  nutritionModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  nutritionModalTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  foodTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  servingSize: {
    color: "#8E8E93",
    fontSize: 16,
    marginBottom: 16,
  },
  nutritionDivider: {
    height: 1,
    backgroundColor: "#2D2D2D",
    marginVertical: 8,
  },
  nutritionLargeDivider: {
    height: 8,
    backgroundColor: "#2D2D2D",
    marginVertical: 12,
  },
  nutritionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  nutritionSubItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
    paddingLeft: 20,
  },
  nutritionLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  nutritionSubLabel: {
    color: "#B3B3B3",
    fontSize: 16,
  },
  nutritionValue: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  addFoodButton: {
    backgroundColor: "#3498db",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  addFoodButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  // Macro Distribution Styles
  macroDistributionContainer: {
    marginVertical: 16,
  },
  distributionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  distributionBar: {
    height: 24,
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#2D2D2D",
  },
  distributionSegment: {
    height: "100%",
  },
  distributionLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    color: "#B3B3B3",
    fontSize: 14,
  },
  // Swipe to Delete Styles
  deleteContainer: {
    marginBottom: 12,
    borderRadius: 12,
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
});
