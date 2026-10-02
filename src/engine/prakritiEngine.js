/**
 * prakritiEngine.js
 * Pure rule-based Prakriti (Ayurvedic constitution) scoring system.
 *
 * This is NOT a medical diagnostic tool.
 * It is a traditional Ayurvedic wellness classification system
 * based on the Charaka Samhita principles.
 *
 * Scoring:
 *   Each question has 3 options — one primarily Vata, one Pitta, one Kapha.
 *   The user's answers accumulate scores for each dosha.
 *   Final Prakriti is determined by which dosha(s) score highest.
 *
 * Structure: questions → options → dosha score mapping → total → Prakriti
 */

export const PRAKRITI_QUESTIONS = [
  {
    id: "body_frame",
    category: "Body",
    question: "How would you describe your natural body frame?",
    options: [
      {
        id: "a",
        text: "Thin and lean — I find it hard to gain weight",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Medium and well-proportioned — moderate build",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Large and sturdy — I gain weight easily",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "skin_type",
    category: "Body",
    question: "How would you describe your skin?",
    options: [
      {
        id: "a",
        text: "Dry, rough, or thin — tends to crack in cold/dry weather",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Sensitive, warm, or reddish — prone to inflammation or rashes",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Oily, smooth, and thick — lustrous and rarely dry",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "hair",
    category: "Body",
    question: "What is your natural hair like?",
    options: [
      {
        id: "a",
        text: "Dry, frizzy, thin, or brittle",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Fine, straight, oily, or premature greying/thinning",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Thick, wavy, oily, and lustrous",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "appetite",
    category: "Digestion",
    question: "How is your appetite?",
    options: [
      {
        id: "a",
        text: "Variable — sometimes very hungry, sometimes not at all",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Strong and consistent — I get irritable if I skip meals",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Slow and steady — I can easily skip meals without irritability",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "digestion",
    category: "Digestion",
    question: "How does your digestion generally work?",
    options: [
      {
        id: "a",
        text: "Irregular — prone to gas, bloating, or constipation",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Sharp — prone to heartburn, acidity, or loose stools",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Slow — digestion takes time, may feel heavy after meals",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "energy",
    category: "Energy & Activity",
    question: "How would you describe your natural energy levels?",
    options: [
      {
        id: "a",
        text: "Bursts of energy followed by exhaustion — variable",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "High and driven — I push hard and accomplish a lot",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Steady and sustained — slow to start but great endurance",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "sleep",
    category: "Energy & Activity",
    question: "How do you sleep?",
    options: [
      {
        id: "a",
        text: "Light sleeper — difficulty falling asleep or waking frequently",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Moderate — sleep well but wake easily if stressed",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Deep, long sleeper — difficult to wake up, love sleeping",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "temperature",
    category: "Energy & Activity",
    question: "What temperatures do you prefer?",
    options: [
      {
        id: "a",
        text: "I love warmth — hate cold, wind, and dry weather",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "I love cool — I feel uncomfortable in heat and hot weather",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "I prefer warm and dry — dislike cold, damp, and cloudy weather",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "mind_style",
    category: "Mind & Emotions",
    question: "How would you describe your thinking style?",
    options: [
      {
        id: "a",
        text: "Quick, creative, imaginative — many ideas but scattered",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Sharp, focused, analytical — decisive and goal-oriented",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Calm, steady, methodical — slow but thorough and reliable",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "stress_response",
    category: "Mind & Emotions",
    question: "When stressed, you tend to...",
    options: [
      {
        id: "a",
        text: "Feel anxious, worried, overwhelmed, or fearful",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Feel angry, irritable, critical, or perfectionistic",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Withdraw, become lethargic, comfort-eat, or feel depressed",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "speech",
    category: "Mind & Emotions",
    question: "How do you typically communicate?",
    options: [
      {
        id: "a",
        text: "Fast, enthusiastic, talkative — jump between topics",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Clear, precise, direct — sometimes blunt or argumentative",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Slow, calm, measured — thoughtful before speaking",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
  {
    id: "memory",
    category: "Mind & Emotions",
    question: "How is your memory?",
    options: [
      {
        id: "a",
        text: "Quick to learn, quick to forget — short-term is strong",
        scores: { vata: 2, pitta: 0, kapha: 0 },
      },
      {
        id: "b",
        text: "Sharp and accurate — good with facts and details",
        scores: { vata: 0, pitta: 2, kapha: 0 },
      },
      {
        id: "c",
        text: "Slow to learn, slow to forget — excellent long-term memory",
        scores: { vata: 0, pitta: 0, kapha: 2 },
      },
    ],
  },
];

/**
 * Calculate Prakriti from questionnaire answers.
 *
 * @param {Object} answers - { questionId: optionId }
 * @returns {Object} { prakriti, doshaScores, primary, secondary, description }
 */
export function calculatePrakriti(answers) {
  const scores = { vata: 0, pitta: 0, kapha: 0 };

  PRAKRITI_QUESTIONS.forEach((q) => {
    const selectedOptionId = answers[q.id];
    if (!selectedOptionId) return;
    const option = q.options.find((o) => o.id === selectedOptionId);
    if (!option) return;
    scores.vata += option.scores.vata;
    scores.pitta += option.scores.pitta;
    scores.kapha += option.scores.kapha;
  });

  const total = scores.vata + scores.pitta + scores.kapha || 1;
  const percentages = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  // Determine Prakriti type
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const [primaryDosha, primaryScore] = sorted[0];
  const [secondaryDosha, secondaryScore] = sorted[1];
  const [, tertiaryScore] = sorted[2];

  const maxScore = PRAKRITI_QUESTIONS.length * 2; // max possible per dosha
  const dominanceThreshold = 0.25; // 25% difference = clear dominance

  let prakriti, prakritiLabel, primaryLabel, secondaryLabel;

  const primaryRatio = primaryScore / total;
  const secondaryRatio = secondaryScore / total;
  const gap = primaryRatio - secondaryRatio;

  if (gap >= dominanceThreshold) {
    // Clear single-dosha dominance
    prakriti = primaryDosha;
    prakritiLabel = capitalize(primaryDosha);
    primaryLabel = capitalize(primaryDosha);
    secondaryLabel = null;
  } else if (
    Math.abs(scores.vata - scores.pitta) <= 2 &&
    Math.abs(scores.pitta - scores.kapha) <= 2 &&
    Math.abs(scores.vata - scores.kapha) <= 2
  ) {
    // All three roughly equal — Tridoshic
    prakriti = "tridoshic";
    prakritiLabel = "Tridoshic";
    primaryLabel = "Tridoshic";
    secondaryLabel = null;
  } else {
    // Dual dosha
    const doshas = sorted.slice(0, 2).map(([d]) => d);
    prakriti = doshas.join("-");
    prakritiLabel =
      capitalize(doshas[0]) + "-" + capitalize(doshas[1]);
    primaryLabel = capitalize(doshas[0]);
    secondaryLabel = capitalize(doshas[1]);
  }

  return {
    prakriti,
    prakritiLabel,
    primaryDosha: primaryLabel,
    secondaryDosha: secondaryLabel,
    doshaScores: scores,
    doshaPercentages: percentages,
    answers,
    description: getPrakritiDescription(prakriti),
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Prakriti descriptions for display */
export function getPrakritiDescription(prakriti) {
  const descriptions = {
    vata: "Vata types are creative, energetic, and quick-thinking but may struggle with irregularity, anxiety, and cold. Balance with warmth, routine, and nourishing foods.",
    pitta: "Pitta types are sharp, focused, and driven but can be prone to inflammation, irritability, and overheating. Balance with cooling foods, rest, and moderation.",
    kapha: "Kapha types are calm, loving, and enduring but can be prone to weight gain, lethargy, and attachment. Balance with stimulation, light foods, and regular exercise.",
    "vata-pitta": "Vata-Pitta types combine creativity with sharp intellect. They need to balance both air/space and fire/water elements — warming yet cooling, grounding yet stimulating.",
    "pitta-kapha": "Pitta-Kapha types are determined, steady, and powerful. They benefit from light, cooling, and stimulating foods to balance both fire and earth energies.",
    "vata-kapha": "Vata-Kapha types are imaginative yet grounded. They need warming, stimulating foods and regular routine to balance the opposing air and earth energies.",
    "pitta-vata": "Pitta-Vata types are sharp and creative. Balance both fire and air — use warming, grounding, and moderately cooling practices.",
    "kapha-pitta": "Kapha-Pitta types are stable yet sharp. Light, stimulating, and moderately cooling choices work best to keep both earth and fire balanced.",
    "kapha-vata": "Kapha-Vata types combine steadiness with creativity. Warming, grounding, and stimulating practices help balance the earth and air energies.",
    tridoshic: "Tridoshic individuals have a naturally balanced constitution. Maintain your balance by eating seasonally, following daily routines, and listening to your body.",
  };
  return descriptions[prakriti] || descriptions.vata;
}

/** Dosha color themes */
export const DOSHA_COLORS = {
  vata: { primary: "#7b1fa2", light: "#f3e5f5", accent: "#ab47bc" },
  pitta: { primary: "#e65100", light: "#fff3e0", accent: "#ef6c00" },
  kapha: { primary: "#1565c0", light: "#e3f2fd", accent: "#1976d2" },
  tridoshic: { primary: "#2e7d32", light: "#e8f5e9", accent: "#43a047" },
};

export function getPrakritiColors(prakriti) {
  if (!prakriti) return DOSHA_COLORS.tridoshic;
  const primary = prakriti.split("-")[0];
  return DOSHA_COLORS[primary] || DOSHA_COLORS.tridoshic;
}
