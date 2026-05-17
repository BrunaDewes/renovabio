import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const REMINDER_HOUR = 9;
const REMINDER_MINUTE = 0;

function getNotificationsKey(userId: number) {
  return `renovabio:notificacoes:${userId}`;
}

function getReminderIdKey(userId: number) {
  return `renovabio:notificacao-diaria:${userId}`;
}

export async function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-reminders', {
      name: 'Lembretes diarios',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function requestNotificationPermission() {
  const currentPermissions = await Notifications.getPermissionsAsync();
  if (currentPermissions.granted) {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  return requestedPermissions.granted;
}

export async function syncDailyMissionReminder(userId: number) {
  const enabled = await AsyncStorage.getItem(getNotificationsKey(userId));

  if (enabled === 'true') {
    const allowed = await requestNotificationPermission();
    if (!allowed) {
      await AsyncStorage.setItem(getNotificationsKey(userId), 'false');
      await cancelDailyMissionReminder(userId);
      return false;
    }

    await scheduleDailyMissionReminder(userId);
    return true;
  }

  await cancelDailyMissionReminder(userId);
  return false;
}

export async function scheduleDailyMissionReminder(userId: number) {
  await cancelDailyMissionReminder(userId);

  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Missao do dia',
      body: 'Nao esqueca de completar sua missao de hoje no RenovaBio.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: REMINDER_HOUR,
      minute: REMINDER_MINUTE,
      ...(Platform.OS === 'android' ? { channelId: 'daily-reminders' } : {}),
    },
  });

  await AsyncStorage.setItem(getReminderIdKey(userId), identifier);
  return identifier;
}

export async function cancelDailyMissionReminder(userId: number) {
  const identifier = await AsyncStorage.getItem(getReminderIdKey(userId));
  if (identifier) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
    await AsyncStorage.removeItem(getReminderIdKey(userId));
  }
}
