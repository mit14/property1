export type SeasonTier = 'off' | 'shoulder' | 'peak';

export interface PriceBreakdown {
  baseRate: number;
  seasonalMultiplier: number;
  weekendMultiplier: number;
  adjustedRate: number;
  season: SeasonTier;
  isWeekend: boolean;
  label: string;
}

const SEASONAL_MULTIPLIERS: Record<SeasonTier, number> = {
  off: 1.0,
  shoulder: 1.25,
  peak: 1.6,
};

const WEEKEND_MULTIPLIER = 1.15;

export function getSeasonForMonth(month: number): SeasonTier {
  if (month >= 6 && month <= 8) return 'peak';
  if (month === 5 || month === 9 || month === 12) return 'shoulder';
  return 'off';
}

export function getSeasonLabel(season: SeasonTier): string {
  switch (season) {
    case 'peak': return 'Peak Season (Summer / Holidays)';
    case 'shoulder': return 'Shoulder Season';
    case 'off': return 'Off Season';
  }
}

export function isWeekendDate(date: Date): boolean {
  const day = date.getDay();
  return day === 5 || day === 6;
}

export function calculateDynamicRate(
  baseNightlyRate: number,
  date: Date
): PriceBreakdown {
  const month = date.getMonth() + 1;
  const season = getSeasonForMonth(month);
  const weekend = isWeekendDate(date);
  const seasonalMultiplier = SEASONAL_MULTIPLIERS[season];
  const weekendMultiplier = weekend ? WEEKEND_MULTIPLIER : 1.0;
  const adjustedRate = Math.round(baseNightlyRate * seasonalMultiplier * weekendMultiplier);

  let label = getSeasonLabel(season);
  if (weekend) label += ' · Weekend';

  return {
    baseRate: baseNightlyRate,
    seasonalMultiplier,
    weekendMultiplier,
    adjustedRate,
    season,
    isWeekend: weekend,
    label,
  };
}

export function getMonthlyRateRange(baseNightlyRate: number, year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  let min = Infinity;
  let max = 0;
  let total = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const { adjustedRate } = calculateDynamicRate(baseNightlyRate, date);
    min = Math.min(min, adjustedRate);
    max = Math.max(max, adjustedRate);
    total += adjustedRate;
  }

  const avg = Math.round(total / daysInMonth);
  const potentialMonthly = total;

  return { min, max, avg, potentialMonthly, daysInMonth };
}

export function getSeasonalProjection(baseNightlyRate: number, year: number) {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  return months.map((month) => {
    const range = getMonthlyRateRange(baseNightlyRate, year, month);
    const season = getSeasonForMonth(month);
    return { month, season, ...range };
  });
}
