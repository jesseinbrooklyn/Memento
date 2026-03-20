// ============================================================
// MEMENTO — Core Component Reference
// Copy-paste-ready React Native components for V1
// ============================================================

// ============================================================
// 1. THEME PROVIDER — src/theme/tokens.ts
// ============================================================

export const colors = {
  bgPrimary: '#14100a',
  bgSecondary: '#1c1710',
  bgTertiary: '#0e0b07',
  gold: '#c4a35a',
  goldDim: 'rgba(196,163,90,0.25)',
  goldGlow: 'rgba(196,163,90,0.06)',
  bone: '#d4c5a0',
  boneDim: 'rgba(212,197,160,0.55)',
  boneGhost: 'rgba(212,197,160,0.25)',
  ember: '#8b4513',
  ash: '#3a3630',
  ink: 'rgba(0,0,0,0.85)',
} as const;

export const fonts = {
  display: 'Cinzel-Regular',
  displayMedium: 'Cinzel-Medium',
  displaySemiBold: 'Cinzel-SemiBold',
  body: 'CormorantGaramond-Regular',
  bodyLight: 'CormorantGaramond-Light',
  bodyMedium: 'CormorantGaramond-Medium',
  bodyItalic: 'CormorantGaramond-Italic',
  bodyMediumItalic: 'CormorantGaramond-MediumItalic',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const borderRadius = {
  sm: 2,   // inputs
  md: 4,   // cards, buttons
  lg: 8,   // modals
} as const;

export const letterSpacing = {
  wide: 5,
  ultra: 8,
} as const;


// ============================================================
// 2. FONT LOADING — App.tsx (root)
// ============================================================

// import * as Font from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
//
// SplashScreen.preventAutoHideAsync();
//
// const [fontsLoaded] = Font.useFonts({
//   'Cinzel-Regular': require('./assets/fonts/Cinzel-Regular.ttf'),
//   'Cinzel-Medium': require('./assets/fonts/Cinzel-Medium.ttf'),
//   'Cinzel-SemiBold': require('./assets/fonts/Cinzel-SemiBold.ttf'),
//   'CormorantGaramond-Regular': require('./assets/fonts/CormorantGaramond-Regular.ttf'),
//   'CormorantGaramond-Light': require('./assets/fonts/CormorantGaramond-Light.ttf'),
//   'CormorantGaramond-Medium': require('./assets/fonts/CormorantGaramond-Medium.ttf'),
//   'CormorantGaramond-Italic': require('./assets/fonts/CormorantGaramond-Italic.ttf'),
//   'CormorantGaramond-MediumItalic': require('./assets/fonts/CormorantGaramond-MediumItalic.ttf'),
// });
//
// useEffect(() => {
//   if (fontsLoaded) SplashScreen.hideAsync();
// }, [fontsLoaded]);


// ============================================================
// 3. VANITAS BACKGROUND — src/components/VanitasBackground.tsx
// ============================================================
//
// Full-screen atmospheric layer: painting + vignette + grain + breathing animation.
// Place behind all screen content with position: 'absolute'.

import React from 'react';
import { View, Image, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { useReducedMotion } from 'react-native-reanimated';

// NOTE: Replace this with your actual vanitas painting asset
// For V1, bundle 2-3 paintings and rotate based on user preference or daily index
// const vanitasPainting = require('../../assets/images/vanitas-skull.jpg');

interface VanitasBackgroundProps {
  /** Override painting source for different screens */
  source?: any;
  /** Opacity of the painting layer (0-1, default 0.18) */
  paintingOpacity?: number;
}

export const VanitasBackground: React.FC<VanitasBackgroundProps> = ({
  // source = vanitasPainting,
  paintingOpacity = 0.18,
}) => {
  const { width, height } = useWindowDimensions();
  const prefersReducedMotion = useReducedMotion();

  // Breathing animation — subtle scale pulse
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    scale.value = withRepeat(
      withTiming(1.008, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite
      true // reverse
    );
  }, [prefersReducedMotion]);

  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Painting layer */}
      <Animated.View style={[styles.paintingContainer, breathingStyle]}>
        {/* Uncomment when painting asset is ready:
        <Image
          source={source}
          style={[styles.painting, { opacity: paintingOpacity }]}
          resizeMode="cover"
        />
        */}
        {/* Placeholder: solid dark background until painting is ready */}
        <View style={[styles.painting, { backgroundColor: '#14100a' }]} />
      </Animated.View>

      {/* Radial vignette — darkens edges */}
      <View style={styles.vignette} />

      {/* Bottom gradient — ensures text contrast */}
      <View style={styles.bottomGradient} />

      {/* Grain texture overlay */}
      <View style={styles.grain} />
    </View>
  );
};

const styles = StyleSheet.create({
  paintingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
  },
  painting: {
    width: '130%',
    height: '100%',
    // Sepia/brightness/contrast filters need to be applied
    // differently in React Native — use expo-image or
    // react-native-image-filter-kit if needed, or pre-process
    // the image with the filter baked in
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    // React Native doesn't support CSS radial-gradient
    // Options: pre-rendered PNG overlay, or use expo-linear-gradient
    // with creative positioning. For V1, a semi-transparent
    // dark border overlay works:
    borderWidth: 80,
    borderColor: 'rgba(20,16,10,0.6)',
    // Or skip vignette in V1 and add via a pre-rendered PNG
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    // Use expo-linear-gradient for this:
    // <LinearGradient colors={['transparent', '#14100a']} />
    backgroundColor: 'transparent', // placeholder
  },
  grain: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
    // Grain texture: use a small repeating PNG tile
    // or skip in V1 if performance is a concern
  },
});


// ============================================================
// 4. DAILY QUOTE COMPONENT — src/components/DailyQuote.tsx
// ============================================================

import { Text, StyleSheet as SS } from 'react-native';

interface Quote {
  id: string;
  text: string;
  author: string;
  source: string;
  authorDates: string;
  context: string;
  themes: string[];
  discipline: 'desire' | 'action' | 'assent';
}

interface DailyQuoteProps {
  quote: Quote;
  /** Show historical context below the attribution */
  showContext?: boolean;
  /** Entrance animation delay in ms */
  animationDelay?: number;
}

export const DailyQuote: React.FC<DailyQuoteProps> = ({
  quote,
  showContext = false,
  animationDelay = 0,
}) => {
  // In production, wrap each Text in an Animated.View with fadeUp
  // using the animationDelay prop for staggered entrance

  return (
    <View style={quoteStyles.container}>
      <Text style={quoteStyles.text}>
        "{quote.text}"
      </Text>
      <Text style={quoteStyles.author}>
        — {quote.author.toUpperCase()}
      </Text>
      <Text style={quoteStyles.source}>
        {quote.source} · {quote.authorDates}
      </Text>
      {showContext && (
        <Text style={quoteStyles.context}>
          {quote.context}
        </Text>
      )}
    </View>
  );
};

const quoteStyles = SS.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    maxWidth: 480,
  },
  text: {
    fontFamily: fonts.bodyItalic,
    fontSize: 20,
    color: colors.bone,
    lineHeight: 36,
    textAlign: 'center',
    opacity: 0.65,
  },
  author: {
    fontFamily: fonts.display,
    fontSize: 11,
    color: colors.gold,
    letterSpacing: letterSpacing.wide,
    marginTop: spacing.md,
  },
  source: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.boneGhost,
    letterSpacing: 2,
    marginTop: spacing.xs,
  },
  context: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.boneDim,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});


// ============================================================
// 5. PRACTICE CALENDAR — src/components/PracticeCalendar.tsx
// ============================================================
//
// Simple dot grid. No streaks, no color coding for gaps.
// Just dots for days practiced.

interface PracticeCalendarProps {
  /** Map of date strings to practiced boolean. e.g., { '2026-03-15': true } */
  practiceData: Record<string, boolean>;
  /** Year-month to display, e.g., '2026-03' */
  month: string;
}

export const PracticeCalendar: React.FC<PracticeCalendarProps> = ({
  practiceData,
  month,
}) => {
  const [year, monthNum] = month.split('-').map(Number);
  const daysInMonth = new Date(year, monthNum, 0).getDate();
  const firstDayOfWeek = new Date(year, monthNum - 1, 1).getDay(); // 0=Sun

  const days: (number | null)[] = [];
  // Pad start
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const today = new Date();
  const todayStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <View style={calStyles.container}>
      {/* Day labels */}
      <View style={calStyles.row}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Text key={i} style={calStyles.dayLabel}>{d}</Text>
        ))}
      </View>
      {/* Day grid */}
      <View style={calStyles.grid}>
        {days.map((day, i) => {
          if (day === null) return <View key={i} style={calStyles.cell} />;
          const dateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const practiced = practiceData[dateStr] || false;
          const isToday = dateStr === todayStr;
          return (
            <View key={i} style={calStyles.cell}>
              <View style={[
                calStyles.dot,
                practiced && calStyles.dotActive,
                isToday && calStyles.dotToday,
              ]} />
            </View>
          );
        })}
      </View>
    </View>
  );
};

const DOT_SIZE = 8;
const CELL_SIZE = 36;

const calStyles = SS.create({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    width: CELL_SIZE * 7,
  },
  dayLabel: {
    width: CELL_SIZE,
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 10,
    color: colors.boneGhost,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: CELL_SIZE * 7,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: 'rgba(196,163,90,0.08)',
  },
  dotActive: {
    backgroundColor: colors.gold,
    opacity: 0.7,
  },
  dotToday: {
    borderWidth: 1,
    borderColor: colors.gold,
  },
});


// ============================================================
// 6. MEMENTO BUTTON — src/components/MementoButton.tsx
// ============================================================
//
// The "I AM AWAKE" / "BEGIN" / "REFLECT" button.
// Gold border, fills on press, Cinzel text.

import { Pressable } from 'react-native';

interface MementoButtonProps {
  label: string;
  onPress: () => void;
  /** Entrance animation delay in ms */
  animationDelay?: number;
}

export const MementoButton: React.FC<MementoButtonProps> = ({
  label,
  onPress,
  animationDelay = 0,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        btnStyles.button,
        pressed && btnStyles.pressed,
      ]}
    >
      {({ pressed }) => (
        <Text style={[
          btnStyles.label,
          pressed && btnStyles.labelPressed,
        ]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
};

const btnStyles = SS.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 52,
    backgroundColor: 'rgba(20,16,10,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(196,163,90,0.25)',
    borderRadius: borderRadius.md,
  },
  pressed: {
    backgroundColor: 'rgba(196,163,90,0.9)',
    borderColor: colors.gold,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 13,
    letterSpacing: letterSpacing.wide,
    color: colors.gold,
    textAlign: 'center',
  },
  labelPressed: {
    color: colors.ink,
  },
});


// ============================================================
// 7. INSCRIPTION — src/components/Inscription.tsx
// ============================================================
//
// Small Latin text used as section markers.
// e.g., "TEMPUS FUGIT", "MEMENTO MORI"

interface InscriptionProps {
  text: string;
  /** Animation delay for fadeUp entrance */
  animationDelay?: number;
}

export const Inscription: React.FC<InscriptionProps> = ({
  text,
  animationDelay = 0,
}) => {
  return (
    <Text style={inscStyles.text}>
      {text}
    </Text>
  );
};

const inscStyles = SS.create({
  text: {
    fontFamily: fonts.display,
    fontSize: 10,
    letterSpacing: letterSpacing.ultra,
    color: colors.gold,
    opacity: 0.25,
    textAlign: 'center',
  },
});


// ============================================================
// 8. VERTICAL DIVIDER — src/components/VerticalDivider.tsx
// ============================================================
//
// The thin gold-to-transparent line used between content sections.

interface VerticalDividerProps {
  height?: number;
}

export const VerticalDivider: React.FC<VerticalDividerProps> = ({
  height = 32,
}) => {
  // In production, use expo-linear-gradient for the fade effect.
  // This is a simplified version:
  return (
    <View style={{
      width: 1,
      height,
      backgroundColor: 'rgba(196,163,90,0.25)',
      opacity: 0.5,
      alignSelf: 'center',
    }} />
  );
};


// ============================================================
// 9. LIFE CALCULATOR UTILITY — src/utils/lifeCalculator.ts
// ============================================================

interface LifeFactors {
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
  return Math.max(expectancy, 40); // floor at 40 years
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

export function calculateRemainingWeeks(days: number): number {
  return Math.floor(days / 7);
}

export function calculateRemainingSeasons(days: number): number {
  return Math.floor(days / 91.25); // ~365.25 / 4
}

export function calculateLifePercentage(birthDate: Date, factors: LifeFactors): number {
  const expectancy = calculateLifeExpectancy(factors);
  const now = new Date();
  const ageMs = now.getTime() - birthDate.getTime();
  const ageYears = ageMs / (365.25 * 86400000);
  return Math.min(Math.round((ageYears / expectancy) * 100), 100);
}


// ============================================================
// 10. DAILY CONTENT UTILITY — src/utils/dailyContent.ts
// ============================================================

import quotesData from '../content/quotes.json';

export function getDailyIndex(poolSize: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  return dayOfYear % poolSize;
}

export function getTodaysQuote(): Quote {
  const index = getDailyIndex(quotesData.length);
  return quotesData[index] as Quote;
}

// Gratitude prompts — embedded directly
const GRATITUDE_PROMPTS = [
  "What would today have been like without your health?",
  "What would today have been like without a roof over your head?",
  "What would today have been like without someone who cares about you?",
  "What would today have been like without the ability to read?",
  "What would today have been like without clean water?",
  "What would today have been like without your sight?",
  "What would today have been like without your freedom to choose?",
  "What would today have been like without your work?",
  "What would today have been like without a warm meal?",
  "What would today have been like without the ability to walk?",
  "What would today have been like without your memory?",
  "What would today have been like without someone to talk to?",
  "What would today have been like without music?",
  "What would today have been like without sleep last night?",
  "What would today have been like without your hands?",
  "What would today have been like without your children?",
  "What would today have been like without a second chance?",
  "What would today have been like without the morning light?",
  "What would today have been like without your voice?",
  "What would today have been like without laughter?",
  "What would today have been like without patience from someone else?",
  "What would today have been like without your ability to learn?",
  "What would today have been like without forgiveness?",
  "What would today have been like without the season changing?",
  "What would today have been like without a quiet moment?",
  "What would today have been like without courage?",
  "What would today have been like without an honest friend?",
  "What would today have been like without your breath?",
  "What would today have been like without the past that shaped you?",
  "What would today have been like without tomorrow to look forward to?",
];

export function getTodaysGratitudePrompt(): string {
  const index = getDailyIndex(GRATITUDE_PROMPTS.length);
  return GRATITUDE_PROMPTS[index];
}


// ============================================================
// 11. DATABASE SETUP — src/repositories/db.ts
// ============================================================

import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('memento.db');
  await initializeTables(db);
  return db;
}

async function initializeTables(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS practice_log (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      morning_complete INTEGER DEFAULT 0,
      evening_complete INTEGER DEFAULT 0,
      intention TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      mode TEXT NOT NULL,
      content TEXT NOT NULL,
      prompt_key TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_quotes (
      id TEXT PRIMARY KEY,
      quote_id TEXT NOT NULL,
      personal_note TEXT,
      saved_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}


// ============================================================
// 12. EXAMPLE REPOSITORY — src/repositories/practice.ts
// ============================================================

import { getDatabase } from './db';
import { usePracticeStore } from '../stores/practice';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function todayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const PracticeRepository = {
  async markMorningComplete(intention: string): Promise<void> {
    const db = await getDatabase();
    const today = todayString();
    const id = generateId();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO practice_log (id, date, morning_complete, intention, created_at)
       VALUES (?, ?, 1, ?, ?)
       ON CONFLICT(date) DO UPDATE SET morning_complete = 1, intention = ?`,
      [id, today, intention, now, intention]
    );

    usePracticeStore.getState().setMorningComplete(today, intention);
  },

  async markEveningComplete(): Promise<void> {
    const db = await getDatabase();
    const today = todayString();
    const id = generateId();
    const now = new Date().toISOString();

    await db.runAsync(
      `INSERT INTO practice_log (id, date, evening_complete, created_at)
       VALUES (?, ?, 1, ?)
       ON CONFLICT(date) DO UPDATE SET evening_complete = 1`,
      [id, today, now]
    );

    usePracticeStore.getState().setEveningComplete(today);
  },

  async getPracticeData(yearMonth: string): Promise<Record<string, boolean>> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ date: string }>(
      `SELECT date FROM practice_log
       WHERE date LIKE ? AND (morning_complete = 1 OR evening_complete = 1)`,
      [`${yearMonth}%`]
    );

    const data: Record<string, boolean> = {};
    for (const row of rows) {
      data[row.date] = true;
    }
    return data;
  },

  async getTotalPracticeDays(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM practice_log
       WHERE morning_complete = 1 OR evening_complete = 1`
    );
    return result?.count ?? 0;
  },
};
