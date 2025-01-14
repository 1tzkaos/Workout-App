// src/screens/FoodScreen/utils/nutrition.js
export const getNutrientValue = (food, nutrientName) => {
  const nutrient = food.foodNutrients.find(
    (n) => n.nutrientName === nutrientName
  );
  return nutrient ? Math.round(nutrient.value * 10) / 10 : 0;
};
