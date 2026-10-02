/**
 * recommendationEngine.js
 * Personalized diet recommendation engine.
 *
 * Inputs:
 *   - prakriti (e.g., "vata", "pitta-kapha")
 *   - currentRutu (e.g., "sharad")
 *   - weather classification (from weatherService.classifyWeather)
 *
 * Output:
 *   - Structured meal recommendations with rationale
 *
 * Rules:
 *   Prakriti Rules + Rutu Rules + Weather Modifiers → Recommendations
 *
 * This is a pure data/rules system — no AI, no randomness.
 */

import { seasons } from "../data/seasons";

// ============================================================
// DOSHA FOOD DATABASES
// Base food recommendations by dosha
// ============================================================

const DOSHA_FOODS = {
  vata: {
    favor: [
      "Warm, cooked foods",
      "Sweet, sour, and salty tastes",
      "Ghee and healthy oils",
      "Root vegetables (carrots, beets, sweet potato)",
      "Warming spices (ginger, cinnamon, cardamom)",
      "Warm milk with nutmeg",
      "Dates, figs, and raisins",
      "Cooked oats and rice",
      "Mung dal soup",
      "Sesame seeds and tahini",
    ],
    limit: [
      "Cold, raw foods",
      "Dry and crunchy foods",
      "Astringent and bitter excess",
      "Carbonated drinks",
      "Legumes that cause gas",
      "Iced beverages",
      "Crackers and dry cereals",
    ],
    meals: {
      breakfast: [
        "Warm oatmeal with ghee, cinnamon, and dates",
        "Sesame toast with avocado",
        "Warm spiced milk with honey",
        "Stewed fruits with cardamom",
        "Poha with warming spices",
      ],
      lunch: [
        "Khichdi with ghee and root vegetables",
        "Mung dal with basmati rice and ghee",
        "Warm soup with sweet potato and ginger",
        "Soft roti with cooked vegetables",
        "Rice with creamy lentil dal",
      ],
      dinner: [
        "Light mung dal soup",
        "Warm kitchari with seasonal vegetables",
        "Steamed vegetables with ghee and warming spices",
        "Small bowl of rice with cooked dal",
        "Warm vegetable khichdi",
      ],
      snacks: [
        "Dates and almonds",
        "Warm herbal tea with honey",
        "Cooked sweet potato wedges",
        "Banana with nut butter",
        "Sesame laddus",
      ],
      hydration: [
        "Warm water throughout the day",
        "Warm ginger tea",
        "Warm milk with turmeric before bed",
        "Fennel seed tea",
        "Cumin-coriander-fennel (CCF) tea",
      ],
    },
  },

  pitta: {
    favor: [
      "Cool, refreshing foods",
      "Sweet, bitter, and astringent tastes",
      "Coconut water and cooling drinks",
      "Fresh, seasonal fruits",
      "Cooling spices (coriander, fennel, mint)",
      "Cucumber, leafy greens, zucchini",
      "Ghee in moderation",
      "Pomegranate and amla",
      "Lime and lemon in small amounts",
      "Fresh coconut",
    ],
    limit: [
      "Spicy, hot, and pungent foods",
      "Sour and fermented foods",
      "Alcohol and caffeine",
      "Fried and oily foods",
      "Red meat",
      "Vinegar and pickles",
      "Excess salt",
      "Tomatoes and chillies in excess",
    ],
    meals: {
      breakfast: [
        "Coconut water with fresh fruit",
        "Sweet rice porridge (Kheer) with cardamom",
        "Cucumber smoothie with mint",
        "Fresh fruit bowl with pomegranate",
        "Cooling oat porridge with rose water",
      ],
      lunch: [
        "White basmati rice with cooling dal (mung or toor)",
        "Cucumber raita with cumin",
        "Leafy salad with lime dressing",
        "Steamed vegetables with coriander chutney",
        "Ridge gourd sabji with roti",
      ],
      dinner: [
        "Light khichdi with cooling vegetables",
        "Mung dal with basmati rice",
        "Cooked zucchini or bottle gourd with ghee",
        "Cool buttermilk or lassi",
        "Warm milk with cardamom before bed",
      ],
      snacks: [
        "Pomegranate seeds",
        "Coconut water",
        "Fresh cucumber with lime",
        "Dates in moderation",
        "Amla juice or fresh amla",
      ],
      hydration: [
        "Cool (not iced) water",
        "Coconut water",
        "Rose water drink",
        "Coriander-fennel tea (cooled)",
        "Pomegranate juice",
      ],
    },
  },

  kapha: {
    favor: [
      "Light, dry, and warming foods",
      "Pungent, bitter, and astringent tastes",
      "Honey (raw, not cooked)",
      "Barley and millet",
      "Legumes (lentils, mung)",
      "Leafy greens and cruciferous vegetables",
      "Ginger, black pepper, turmeric",
      "Warming spices liberally",
      "Bitter greens and sprouts",
      "Light fruits like apples and berries",
    ],
    limit: [
      "Heavy, oily, and sweet foods",
      "Dairy in excess",
      "Fried and processed foods",
      "Excess carbohydrates",
      "Cold and iced beverages",
      "Excessive sweets and desserts",
      "Wheat in excess",
      "Avocado and bananas",
    ],
    meals: {
      breakfast: [
        "Warm ginger-lemon water (first thing)",
        "Light barley or millet porridge",
        "Tulsi and ginger tea",
        "Spiced apple with cinnamon",
        "Poha with pungent spices",
      ],
      lunch: [
        "Barley khichdi with minimal ghee",
        "Lentil soup with black pepper and ginger",
        "Bitter gourd sabji with millet roti",
        "Mixed vegetable stir-fry with spices",
        "Light grain bowl with sprouts",
      ],
      dinner: [
        "Light mung soup with ginger",
        "Steamed vegetables with turmeric and pepper",
        "Small portion of old basmati rice with dal",
        "Spiced vegetable broth",
        "Lightly cooked leafy greens",
      ],
      snacks: [
        "Roasted chickpeas",
        "Apple or pear with cinnamon",
        "Warm herbal tea (ginger + tulsi)",
        "Sunflower seeds",
        "Spiced puffed rice",
      ],
      hydration: [
        "Warm water with lemon and honey",
        "Ginger tea",
        "Tulsi tea",
        "Warm CCF tea (cumin-coriander-fennel)",
        "Hot herbal infusions",
      ],
    },
  },
};

// ============================================================
// RUTU (SEASONAL) MODIFIERS
// Adjustments to base dosha recommendations based on season
// ============================================================

const RUTU_MODIFIERS = {
  vasanta: {
    emphasis: "Light, dry, warming foods to clear accumulated Kapha",
    addFoods: ["Barley water", "Honey in warm water", "Bitter vegetables (neem, karela)", "Mung dal"],
    reduceFoods: ["Heavy dairy", "Cold beverages", "Sweets", "Fried snacks"],
    specialTip: "Favour bitter and pungent tastes this season to cleanse the system.",
  },
  grishma: {
    emphasis: "Cooling, hydrating, and easily digestible foods",
    addFoods: ["Coconut water", "Fresh seasonal fruits", "Rose milk", "Buttermilk"],
    reduceFoods: ["Spicy food", "Alcohol", "Heavy meats", "Fermented foods"],
    specialTip: "Stay hydrated with cool (not iced) liquids. Avoid heavy activity in midday heat.",
  },
  varsha: {
    emphasis: "Warm, easy-to-digest foods to support weakened Agni",
    addFoods: ["Warm ginger water", "Mung dal khichdi", "Cooked vegetables", "Honey"],
    reduceFoods: ["Raw vegetables", "River fish", "Cold foods", "Heavy pulses"],
    specialTip: "Digestive fire is weak in monsoon. Eat light, cooked, and warm foods only.",
  },
  sharad: {
    emphasis: "Sweet and cooling foods to pacify Pitta aggravated in monsoon",
    addFoods: ["Amla", "Pomegranate", "White rice", "Cooling spices (coriander, fennel)"],
    reduceFoods: ["Yoghurt", "Excess oil", "Alcohol", "Very spicy food"],
    specialTip: "Moonlight walks and light, refreshing foods help cool down aggravated Pitta.",
  },
  hemanta: {
    emphasis: "Nourishing and heavy foods to build strength and Ojas",
    addFoods: ["Sesame", "Urad dal", "Ghee generously", "Dates and almonds", "Warm soups"],
    reduceFoods: ["Raw cold foods", "Dry crackers", "Excessive fasting"],
    specialTip: "Digestive fire is strongest now. Build strength with nourishing, hearty foods.",
  },
  shishira: {
    emphasis: "Warming and unctuous foods to counter cold and Vata-Kapha",
    addFoods: ["Jaggery", "Sesame products", "Ginger", "Warm herbal teas", "Root vegetables"],
    reduceFoods: ["Cold foods", "Dry and light foods", "Salads", "Raw vegetables"],
    specialTip: "Oil massage (Abhyanga) before bathing is especially beneficial this season.",
  },
};

// ============================================================
// WEATHER MODIFIERS
// Fine-tuning based on current weather conditions
// ============================================================

function getWeatherModifiers(weatherClassification) {
  const mods = { addNotes: [], tips: [] };
  if (!weatherClassification) return mods;

  const { isHot, isCold, isHumid, isDry, isRainy, isClear } = weatherClassification;

  if (isHot) {
    mods.addNotes.push("Today is hot — favour cooling and hydrating foods.");
    mods.tips.push("Drink plenty of cool (not iced) water. Avoid spicy food today.");
  }
  if (isCold) {
    mods.addNotes.push("Today is cold — warm, spiced foods will support your body.");
    mods.tips.push("Start the day with warm ginger water. Dress warmly.");
  }
  if (isHumid) {
    mods.addNotes.push("High humidity — lighter foods will feel more comfortable.");
    mods.tips.push("Avoid heavy, oily foods that feel heavier in humid conditions.");
  }
  if (isDry) {
    mods.addNotes.push("Air is dry — focus on hydrating and unctuous foods.");
    mods.tips.push("Oil massage is especially helpful on dry days. Stay well hydrated.");
  }
  if (isRainy) {
    mods.addNotes.push("Rainy weather — digestive fire may be lower. Keep meals light and warm.");
    mods.tips.push("Avoid raw foods and cold beverages in rainy weather.");
  }
  if (isClear) {
    mods.tips.push("Enjoy outdoor exercise in the fresh morning air.");
  }

  return mods;
}

// ============================================================
// MAIN RECOMMENDATION FUNCTION
// ============================================================

/**
 * Generate personalized diet recommendations.
 *
 * @param {string} prakriti - e.g., "vata", "pitta-kapha"
 * @param {string} rutuId - e.g., "sharad"
 * @param {Object|null} weatherClassification - from weatherService.classifyWeather()
 * @returns {Object} Complete recommendation object
 */
export function generateRecommendations(prakriti, rutuId, weatherClassification = null) {
  // 1. Get primary dosha for food rules
  const primaryDosha = prakriti ? prakriti.split("-")[0] : "vata";
  const secondaryDosha = prakriti?.includes("-") ? prakriti.split("-")[1] : null;

  // 2. Base meals from primary dosha
  const baseFoods = DOSHA_FOODS[primaryDosha] || DOSHA_FOODS.vata;

  // 3. Seasonal modifier
  const rutuMod = RUTU_MODIFIERS[rutuId] || RUTU_MODIFIERS.sharad;
  const rutuData = seasons.find((s) => s.id === rutuId);

  // 4. Weather modifier
  const weatherMod = getWeatherModifiers(weatherClassification);

  // 5. If dual-dosha, merge secondary insights
  let secondaryInsight = null;
  if (secondaryDosha && DOSHA_FOODS[secondaryDosha]) {
    const secondary = DOSHA_FOODS[secondaryDosha];
    secondaryInsight = {
      dosha: secondaryDosha,
      additionalFavor: secondary.favor.slice(0, 3),
      additionalLimit: secondary.limit.slice(0, 2),
    };
  }

  return {
    prakriti,
    primaryDosha,
    secondaryDosha,
    rutuId,
    meals: {
      breakfast: baseFoods.meals.breakfast,
      lunch: baseFoods.meals.lunch,
      dinner: baseFoods.meals.dinner,
      snacks: baseFoods.meals.snacks,
      hydration: baseFoods.meals.hydration,
    },
    favorFoods: [
      ...baseFoods.favor,
      ...(rutuMod.addFoods || []),
    ],
    limitFoods: [
      ...baseFoods.limit,
      ...(rutuMod.reduceFoods || []),
    ],
    seasonalEmphasis: rutuMod.emphasis,
    seasonalTip: rutuMod.specialTip,
    weatherNotes: weatherMod.addNotes,
    weatherTips: weatherMod.tips,
    secondaryInsight,
    rutuDietTips: rutuData?.dietTips || [],
    rationale: buildRationale(prakriti, rutuId, rutuData, weatherClassification),
    disclaimer:
      "These recommendations are based on traditional Ayurvedic principles and are intended for general wellness guidance only. They are not medical advice. Please consult a qualified healthcare professional for any health concerns.",
  };
}

function buildRationale(prakriti, rutuId, rutuData, weather) {
  const parts = [];
  if (prakriti) parts.push(`your ${prakriti.charAt(0).toUpperCase() + prakriti.slice(1)} Prakriti`);
  if (rutuData) parts.push(`the current ${rutuData.name} Ritu (${rutuData.englishName})`);
  if (weather?.temperature !== undefined)
    parts.push(`today's weather (${weather.temperature}°C, ${weather.condition})`);
  if (parts.length === 0) return "Based on Ayurvedic seasonal guidelines.";
  return `Based on ${parts.join(", ")}.`;
}
