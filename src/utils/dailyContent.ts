import quotesData from '../content/quotes.json';
import { Quote } from '../types';

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

const GRATITUDE_PROMPTS = [
  "What would today have been like without your health?",
  "What would today have been like without someone who cares about you?",
  "What would today have been like without your ability to read?",
  "What would today have been like without your sight?",
  "What would today have been like without your freedom to choose?",
  "What would today have been like without a warm meal?",
  "What would today have been like without someone to talk to?",
  "What would today have been like without the ability to start over?",
  "What would today have been like without the people who depend on you?",
  "What would today have been like without the lessons your failures taught you?",
  "What would today have been like without the ability to feel pain?",
  "What would today have been like without a mind that can change?",
  "What would today have been like without the work that demands something of you?",
  "What would today have been like without the memory of someone who shaped you?",
  "What would today have been like without the silence to think?",
  "What would today have been like without the knowledge that it will end?",
  "What would today have been like without the weight you carry for others?",
  "What would today have been like without your ability to walk away?",
  "What would today have been like without the roof that sheltered you last night?",
  "What would today have been like without the stranger who showed you unexpected kindness?",
  "What would today have been like without the discipline you have built, however imperfect?",
  "What would today have been like without the child who looks to you for guidance?",
  "What would today have been like without the difficult truth someone told you?",
  "What would today have been like without your hands and what they can still make?",
  "What would today have been like without the morning itself, which many did not see?",
  "What would today have been like without the capacity to forgive, even if you have not used it?",
  "What would today have been like without the teacher whose words still echo in your mind?",
  "What would today have been like without the season that is changing around you?",
  "What would today have been like without the hunger that drives you to become better?",
  "What would today have been like without the breath you just drew without thinking?"
];

export function getTodaysGratitudePrompt(): string {
  const index = getDailyIndex(GRATITUDE_PROMPTS.length);
  return GRATITUDE_PROMPTS[index];
}

const STOIC_PROMPTS = [
  "What is within my control today, and what is not?",
  "How would my ideal self respond to the biggest challenge I face right now?",
  "If I knew I only had one year left to live, what would I stop doing today?",
  "What negative emotion am I holding onto, and how can I let it go?",
  "Where am I demanding that the world bend to my wishes rather than accepting it?",
  "Am I acting out of habit or out of intention?",
  "What small difficulty can I voluntarily endure today to strengthen my resilience?"
];

export function getRandomStoicPrompt(): string {
  const index = Math.floor(Math.random() * STOIC_PROMPTS.length);
  return STOIC_PROMPTS[index];
}
