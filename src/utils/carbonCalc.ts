export interface OnboardingAnswers {
  commute: 'solo_car' | 'carpool' | 'transit' | 'bike_walk';
  diet: 'heavy_meat' | 'moderate_meat' | 'vegetarian' | 'vegan';
  home: 'large_ac' | 'moderate' | 'eco_conscious';
}

export interface FootprintBreakdown {
  transport: number;
  food: number;
  home: number;
  goods: number;
  total: number;
}

// Baseline values for carbon emissions per month in kg
export const BASELINE_FOOTPRINTS = {
  commute: {
    solo_car: 200,
    carpool: 100,
    transit: 50,
    bike_walk: 5
  },
  diet: {
    heavy_meat: 100,
    moderate_meat: 65,
    vegetarian: 30,
    vegan: 15
  },
  home: {
    large_ac: 150,
    moderate: 85,
    eco_conscious: 40
  },
  goods: 50 // constant baseline for shopping/misc
};

/**
 * Calculate the user's initial footprint breakdown based on onboarding answers
 */
export function calculateInitialFootprint(answers: OnboardingAnswers): FootprintBreakdown {
  const transport = BASELINE_FOOTPRINTS.commute[answers.commute] || 100;
  const food = BASELINE_FOOTPRINTS.diet[answers.diet] || 50;
  const home = BASELINE_FOOTPRINTS.home[answers.home] || 80;
  const goods = BASELINE_FOOTPRINTS.goods;

  return {
    transport,
    food,
    home,
    goods,
    total: transport + food + home + goods
  };
}

/**
 * Translate carbon savings (kg of CO2) into fun real-world equivalents
 */
export interface CarbonEquivalents {
  treesPlanted: number;
  carMilesAvoided: number;
  phonesCharged: number;
  trashBagsDiverted: number;
}

export function getCarbonEquivalents(savedKg: number): CarbonEquivalents {
  return {
    // 1 tree absorbs ~1.67 kg of CO2 per month (20 kg per year)
    treesPlanted: Math.round((savedKg / 1.67) * 10) / 10,
    // Average passenger vehicle emits ~0.4 kg CO2 per mile
    carMilesAvoided: Math.round(savedKg / 0.4),
    // Charging a smartphone absorbs ~0.008 kg CO2 (8.3 grams)
    phonesCharged: Math.round(savedKg / 0.0083),
    // Diverting a bag of waste from landfill saves ~15 kg CO2
    trashBagsDiverted: Math.round((savedKg / 15) * 10) / 10
  };
}

/**
 * Determine dynamic theme classes and character states based on active footprint percentage
 * normalizedScore: 0 (excellent/zero impact) to 1 (terrible/high impact)
 */
export interface DynamicTheme {
  themeName: 'healthy' | 'neutral' | 'polluted';
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  shadowColor: string;
  characterState: 'happy' | 'neutral' | 'sad';
  ambientMusicSpeed: number;
}

export function getDynamicTheme(totalFootprint: number, _initialTotal: number): DynamicTheme {
  // Evaluate states based on absolute monthly carbon footprint values:
  // High Footprint (> 300 kg/mo): Polluted / Sad
  // Moderate Footprint (150 - 300 kg/mo): Neutral / Balanced
  // Low Footprint (< 150 kg/mo): Healthy / Happy
  if (totalFootprint > 300) {
    return {
      themeName: 'polluted',
      accentColor: '#EF4444', // Red-500
      backgroundColor: '#FEF2F2', // Red-50
      borderColor: '#111827',
      shadowColor: '#EF4444',
      characterState: 'sad',
      ambientMusicSpeed: 1.5 // faster/more urgent sound
    };
  } else if (totalFootprint >= 150) {
    return {
      themeName: 'neutral',
      accentColor: '#F59E0B', // Amber-500
      backgroundColor: '#FFFBEB', // Amber-50
      borderColor: '#111827',
      shadowColor: '#F59E0B',
      characterState: 'neutral',
      ambientMusicSpeed: 1.0
    };
  } else {
    return {
      themeName: 'healthy',
      accentColor: '#10B981', // Emerald-500
      backgroundColor: '#ECFDF5', // Emerald-50
      borderColor: '#111827',
      shadowColor: '#10B981',
      characterState: 'happy',
      ambientMusicSpeed: 0.7 // slow/calm ambient
    };
  }
}
