import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function registerForPushNotifications() {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  await AsyncStorage.setItem('pushToken', token);

  // Here you would typically send this token to your backend
  // await sendPushTokenToBackend(token);
}

export function listenForPushNotifications(notificationHandler) {
  Notifications.addNotificationReceivedListener(notificationHandler);
}