// nutrition.js - Update getNutrientValue function
export const getNutrientValue = (food, nutrientName) => {
  // Mapping of nutrient names to IDs
  const nutrientIds = {
    Energy: 1008,
    Protein: 1003,
    "Total lipid (fat)": 1004,
    "Carbohydrate, by difference": 1005,
    "Fiber, total dietary": 1079,
    "Sugars, total": 2000,
  };

  const nutrient = food.foodNutrients.find(
    (n) =>
      n.nutrientName === nutrientName ||
      n.nutrientId === nutrientIds[nutrientName]
  );

  return nutrient ? Math.round(nutrient.value * 10) / 10 : 0;
};
