export interface LifeFactors {
  smoking: 'none' | 'former' | 'light' | 'heavy';
  drinking: 'none' | 'moderate' | 'heavy' | 'very_heavy';
  exercise: 'daily' | 'regular' | 'occasional' | 'none';
  diet: 'excellent' | 'good' | 'average' | 'poor';
  sleep: 'optimal' | 'good' | 'fair' | 'poor';
}

const BASE_LIFE_EXPECTANCY = 78.5;

const FACTOR_ADJUSTMENTS: Record<keyof LifeFactors, Record<string, number>> = {
  smoking: { none: 0, former: -3, light: -6, heavy: -10 },
  drinking: { none: 0, moderate: -0.5, heavy: -3, very_heavy: -6 },
  exercise: { daily: 4, regular: 2, occasional: 0, none: -3 },
  diet: { excellent: 3, good: 1.5, average: 0, poor: -3 },
  sleep: { optimal: 1.5, good: 0.5, fair: 0, poor: -2 },
};

export function calculateLifeExpectancy(factors: LifeFactors): number {
  let expectancy = BASE_LIFE_EXPECTANCY;
  for (const [key, value] of Object.entries(factors)) {
    const adjustment = FACTOR_ADJUSTMENTS[key as keyof LifeFactors]?.[value] ?? 0;
    expectancy += adjustment;
  }
  return Math.max(expectancy, 40);
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
