import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import quotesData from '../content/quotes.json';

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
      lightColor: '#D4AF37', // Gold
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

function getDailyQuoteSnippet(daysOffset: number): string {
  const now = new Date();
  now.setDate(now.getDate() + daysOffset);
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const index = dayOfYear % quotesData.length;
  const fullQuote = quotesData[index].text;
  
  const words = fullQuote.split(' ').slice(0, 8);
  let snippet = words.join(' ');
  // clean up punctuation at end if chopped
  snippet = snippet.replace(/[.,;:]$/, '');
  return `"${snippet}..."`;
}

export async function scheduleBells(morningTime: string | null, eveningTime: string | null): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted') return;

  const scheduleForDays = 14; 
  
  for (let i = 0; i < scheduleForDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    if (morningTime) {
      const [mHour, mMinute] = morningTime.split(':').map(Number);
      if (!isNaN(mHour) && !isNaN(mMinute)) {
        const triggerDate = new Date(date);
        triggerDate.setHours(mHour, mMinute, 0, 0);
        
        // Only schedule if the trigger is physically in the future
        if (triggerDate.getTime() > Date.now()) {
          const quoteSnippet = getDailyQuoteSnippet(i);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Morning Awakening',
              body: `Remember. ${quoteSnippet}`,
              sound: true,
            },
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate } as Notifications.NotificationTriggerInput,
          });
        }
      }
    }

    if (eveningTime) {
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
            trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate } as Notifications.NotificationTriggerInput,
          });
        }
      }
    }
  }
}
