import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import quotesData from '../content/quotes.json';
import { getDailyIndex } from './dailyContent';
import { colors } from '../theme/tokens';

// Configure behavior when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('memento-bells', {
      name: 'Memento Bells',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: colors.gold,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Returns the first 8 words of the day's quote as a notification snippet.
 * Uses getDailyIndex so the snippet always matches the in-app quote.
 */
function getDailyQuoteSnippet(daysOffset: number): string {
  // Simulate the target day's index by shifting the current date
  const target = new Date();
  target.setDate(target.getDate() + daysOffset);
  const start = new Date(target.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((target.getTime() - start.getTime()) / 86400000);
  const index = getDailyIndex(quotesData.length);
  // Use the day-shifted index for the target day so the snippet matches the in-app quote
  const shiftedIndex = dayOfYear % quotesData.length;
  const fullQuote = quotesData[shiftedIndex].text;

  const words = fullQuote.split(' ').slice(0, 8);
  let snippet = words.join(' ').replace(/[.,;:]$/, '');
  return `"${snippet}..."`;
}

export async function scheduleBells(
  morningTime: string | null,
  eveningTime: string | null,
  morningAlreadyComplete = false,
  eveningAlreadyComplete = false,
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted') return;

  // Schedule 30 days out so users rarely notice a gap on reinstall
  const scheduleForDays = 30;

  for (let i = 0; i < scheduleForDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const isToday = i === 0;

    if (morningTime) {
      // Smart scheduling: skip today's morning bell if the practice is already done
      const skipMorning = isToday && morningAlreadyComplete;
      if (!skipMorning) {
        const [mHour, mMinute] = morningTime.split(':').map(Number);
        if (!isNaN(mHour) && !isNaN(mMinute)) {
          const triggerDate = new Date(date);
          triggerDate.setHours(mHour, mMinute, 0, 0);
          if (triggerDate.getTime() > Date.now()) {
            const quoteSnippet = getDailyQuoteSnippet(i);
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Morning Awakening',
                body: `Remember. ${quoteSnippet}`,
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
              } as Notifications.NotificationTriggerInput,
            });
          }
        }
      }
    }

    if (eveningTime) {
      // Smart scheduling: skip today's evening bell if the practice is already done
      const skipEvening = isToday && eveningAlreadyComplete;
      if (!skipEvening) {
        const [eHour, eMinute] = eveningTime.split(':').map(Number);
        if (!isNaN(eHour) && !isNaN(eMinute)) {
          const triggerDate = new Date(date);
          triggerDate.setHours(eHour, eMinute, 0, 0);
          if (triggerDate.getTime() > Date.now()) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Evening Reflection',
                body: 'The day is ending. Reflect.',
                sound: true,
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
              } as Notifications.NotificationTriggerInput,
            });
          }
        }
      }
    }
  }
}
