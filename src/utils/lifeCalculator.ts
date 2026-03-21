export interface LifeFactors {
  smoking: 'none' | 'former' | 'light' | 'heavy';
  drinking: 'none' | 'moderate' | 'heavy' | 'very_heavy';
  exercise: 'daily' | 'regular' | 'occasional' | 'none';
  diet: 'excellent' | 'good' | 'average' | 'poor';
  sleep: 'optimal' | 'good' | 'fair' | 'poor';
}

// CDC NCHS Data Brief 548 (2024): US male life expectancy
const BASE_LIFE_EXPECTANCY = 76.5;

// Sources:
// Smoking: Jha et al., NEJM 2013; Thomson et al., NEJM Evidence 2024
// Drinking: Wood et al., Lancet 2018; Zhao et al., JAMA Network Open 2023
// Exercise: Moore et al., PLOS Medicine 2012
// Diet: Fadnes et al., PLOS Medicine 2022 (feasibility-adjusted)
// Sleep: Cappuccio et al., Sleep 2010; OHSU 2025
const FACTOR_ADJUSTMENTS: Record<keyof LifeFactors, Record<string, number>> = {
  smoking: { none: 0, former: -3, light: -5, heavy: -10 },
  drinking: { none: 0, moderate: 0, heavy: -2, very_heavy: -5 },
  exercise: { daily: 4.5, regular: 3.5, occasional: 1.5, none: 0 },
  diet: { excellent: 6, good: 3, average: 0, poor: -2 },
  sleep: { optimal: 0, good: -0.5, fair: -2, poor: -5 },
};

// Combined negative factors share overlapping disease pathways
// (cardiovascular, cancer, metabolic). Naive summation overestimates
// total loss. Compress net negatives by 25% when total loss > 10 years.
const NEGATIVE_COMPRESSION = 0.75;
const COMPRESSION_THRESHOLD = 10;

export function calculateLifeExpectancy(factors: LifeFactors): number {
  let gains = 0;
  let losses = 0;

  for (const [key, value] of Object.entries(factors)) {
    const adjustment = FACTOR_ADJUSTMENTS[key as keyof LifeFactors]?.[value] ?? 0;
    if (adjustment >= 0) {
      gains += adjustment;
    } else {
      losses += adjustment;
    }
  }

  const compressedLosses = losses < -COMPRESSION_THRESHOLD
    ? -COMPRESSION_THRESHOLD + (losses + COMPRESSION_THRESHOLD) * NEGATIVE_COMPRESSION
    : losses;

  return Math.max(BASE_LIFE_EXPECTANCY + gains + compressedLosses, 40);
}

export function calculateRemainingDays(birthDate: Date, factors: LifeFactors): number {
  const expectancy = calculateLifeExpectancy(factors);
  const deathDate = new Date(birthDate);
  deathDate.setFullYear(deathDate.getFullYear() + Math.floor(expectancy));
  deathDate.setMonth(deathDate.getMonth() + Math.round((expectancy % 1) * 12));

  const now = new Date();
  const msRemaining = deathDate.getTime() - now.getTime();
  return Math.max(Math.floor(msRemaining / 86400000), 0);
}
