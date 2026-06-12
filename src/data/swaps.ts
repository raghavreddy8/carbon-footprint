export interface Swap {
  id: string;
  title: string;
  category: 'transport' | 'food' | 'home' | 'goods';
  description: string;
  originalHabit: string;
  alternativeHabit: string;
  costCO2: number; // monthly carbon cost of original habit in kg
  savedCO2: number; // monthly carbon saved by swapping in kg
  impactLevel: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const SWAP_DATABASE: Swap[] = [
  // --- TRANSPORT ---
  {
    id: 'trans_bike',
    title: 'Pedal Power',
    category: 'transport',
    description: 'Swap your solo car commute for a bicycle or e-bike. Great for the heart, clean for the air.',
    originalHabit: 'Solo gasoline car commute',
    alternativeHabit: 'Biking or e-biking',
    costCO2: 180,
    savedCO2: 150,
    impactLevel: 'high',
    difficulty: 'hard'
  },
  {
    id: 'trans_bus',
    title: 'Transit Rider',
    category: 'transport',
    description: 'Ditch the steering wheel and hop on a bus or train. Read, listen to music, or relax during your trip.',
    originalHabit: 'Driving a personal car',
    alternativeHabit: 'Riding public transit',
    costCO2: 180,
    savedCO2: 120,
    impactLevel: 'high',
    difficulty: 'medium'
  },
  {
    id: 'trans_carpool',
    title: 'Carpool Club',
    category: 'transport',
    description: 'Share a ride to work or school with a coworker, friend, or neighbor.',
    originalHabit: 'Driving alone to work',
    alternativeHabit: 'Carpooling with 1-2 people',
    costCO2: 180,
    savedCO2: 90,
    impactLevel: 'medium',
    difficulty: 'easy'
  },
  {
    id: 'trans_wfh',
    title: 'Remote Day',
    category: 'transport',
    description: 'Work from home just one day a week to eliminate a full day of travel emissions.',
    originalHabit: '5-day in-office commute',
    alternativeHabit: 'Working from home 1 day/week',
    costCO2: 180,
    savedCO2: 36,
    impactLevel: 'medium',
    difficulty: 'easy'
  },

  // --- FOOD ---
  {
    id: 'food_beef',
    title: 'Beefless Burger',
    category: 'food',
    description: 'Swap beef for plant-based alternatives or chicken. Beef is one of the highest-impact foods globally.',
    originalHabit: 'Eating beef hamburgers',
    alternativeHabit: 'Eating plant-based burgers',
    costCO2: 85,
    savedCO2: 65,
    impactLevel: 'high',
    difficulty: 'medium'
  },
  {
    id: 'food_milk',
    title: 'Oat Over Dairy',
    category: 'food',
    description: 'Use oat, almond, or soy milk instead of dairy milk in your morning drinks.',
    originalHabit: 'Drinking cow dairy milk',
    alternativeHabit: 'Using plant-based milk alternatives',
    costCO2: 15,
    savedCO2: 10,
    impactLevel: 'low',
    difficulty: 'easy'
  },
  {
    id: 'food_waste',
    title: 'Empty Fridge Club',
    category: 'food',
    description: 'Plan meals, buy only what you need, and eat leftovers to bring your food waste down to zero.',
    originalHabit: 'Throwing away 20% of groceries',
    alternativeHabit: 'Zero food waste meal-planning',
    costCO2: 30,
    savedCO2: 25,
    impactLevel: 'medium',
    difficulty: 'medium'
  },
  {
    id: 'food_local',
    title: 'Farmer Market Finds',
    category: 'food',
    description: 'Buy fresh, locally-grown fruits and vegetables instead of food shipped from overseas.',
    originalHabit: 'Buying imported grocery store produce',
    alternativeHabit: 'Eating local, seasonal produce',
    costCO2: 25,
    savedCO2: 15,
    impactLevel: 'medium',
    difficulty: 'easy'
  },

  // --- HOME ENERGY ---
  {
    id: 'home_cold',
    title: 'Chilly Wash',
    category: 'home',
    description: 'Wash your clothes in cold water instead of hot. Today\'s detergents clean just as well in cold.',
    originalHabit: 'Washing clothes in hot water',
    alternativeHabit: 'Cold water laundry cycles',
    costCO2: 22,
    savedCO2: 18,
    impactLevel: 'medium',
    difficulty: 'easy'
  },
  {
    id: 'home_thermo',
    title: 'Thermostat Nudge',
    category: 'home',
    description: 'Nudge your thermostat 2°F down in winter (or 2°F up in summer) and wear a cozy sweater.',
    originalHabit: 'Keeping home climate ultra-high/low',
    alternativeHabit: 'Setting thermostat 2°F closer to outside',
    costCO2: 90,
    savedCO2: 35,
    impactLevel: 'high',
    difficulty: 'easy'
  },
  {
    id: 'home_dryer',
    title: 'Solar Drying',
    category: 'home',
    description: 'Hang your laundry on a drying rack or clothesline instead of running the tumble dryer.',
    originalHabit: 'Using an electric tumble dryer',
    alternativeHabit: 'Air drying clothes',
    costCO2: 35,
    savedCO2: 28,
    impactLevel: 'medium',
    difficulty: 'medium'
  },
  {
    id: 'home_led',
    title: 'Bright Ideas',
    category: 'home',
    description: 'Replace standard incandescent bulbs with long-lasting, energy-efficient LED light bulbs.',
    originalHabit: 'Old incandescent light bulbs',
    alternativeHabit: 'Energy Star LED bulbs',
    costCO2: 15,
    savedCO2: 12,
    impactLevel: 'low',
    difficulty: 'easy'
  },

  // --- CONSUMER GOODS ---
  {
    id: 'goods_clothes',
    title: 'Thrift Shop Stylist',
    category: 'goods',
    description: 'Buy your next clothing item second-hand. Reduces textile waste and manufacturing emissions.',
    originalHabit: 'Buying new fast fashion garments',
    alternativeHabit: 'Thrifting / Vintage shopping',
    costCO2: 40,
    savedCO2: 30,
    impactLevel: 'medium',
    difficulty: 'medium'
  },
  {
    id: 'goods_bags',
    title: 'Tote Bags Triumph',
    category: 'goods',
    description: 'Keep reusable shopping bags in your car or backpack and say "no" to plastic/paper store bags.',
    originalHabit: 'Using single-use plastic store bags',
    alternativeHabit: 'Bringing reusable cotton canvas bags',
    costCO2: 5,
    savedCO2: 4.5,
    impactLevel: 'low',
    difficulty: 'easy'
  },
  {
    id: 'goods_rent',
    title: 'Tool Library Friend',
    category: 'goods',
    description: 'Rent or borrow power tools, party supplies, and luggage rather than buying them for one-time use.',
    originalHabit: 'Buying single-use items/tools',
    alternativeHabit: 'Borrowing from neighbors or renting',
    costCO2: 15,
    savedCO2: 11,
    impactLevel: 'low',
    difficulty: 'medium'
  },
  {
    id: 'goods_utensils',
    title: 'Bring Your Own',
    category: 'goods',
    description: 'Decline plastic cutlery on takeout orders. Keep a reusable set of metal utensils in your office drawer.',
    originalHabit: 'Throwaway plastic takeout cutlery',
    alternativeHabit: 'Using personal reusable utensils',
    costCO2: 3,
    savedCO2: 2.5,
    impactLevel: 'low',
    difficulty: 'easy'
  }
];
