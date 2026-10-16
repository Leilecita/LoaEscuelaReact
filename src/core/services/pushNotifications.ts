import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import api from './axiosClient';


function logRemote(msg: string, extra?: any) {
 fetch('https://school.loasurf.com.ar/log_push.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
   msg,
   extra,
   date: new Date().toISOString(),
  }),
 }).catch(() => { });
}

export async function registerForPushNotifications(userId?: number) {
 console.log('🚀 registerForPushNotifications ejecutándose');
 logRemote('🚀 registerForPushNotifications ejecutándose');


 const { status: existingStatus } = await Notifications.getPermissionsAsync();
 let finalStatus = existingStatus;

 if (existingStatus !== 'granted') {
  const { status } = await Notifications.requestPermissionsAsync();
  finalStatus = status;
 }

 console.log('🔐 finalStatus:', finalStatus);

 if (finalStatus !== 'granted') {
  console.log('❌ Push permission not granted');
  return;
 }

 const projectId = Constants.expoConfig?.extra?.eas?.projectId;

 console.log('🧪 projectId runtime:', projectId);

 if (!projectId) {
  console.log('❌ No projectId disponible en runtime');
  return;
 }


 logRemote('🔐 finalStatus', finalStatus);

 logRemote('🧪 antes de pedir token');
 console.log('🧪 antes de pedir token');

 const tokenData = await Notifications.getExpoPushTokenAsync({
  projectId,
 });

 console.log('🧪 despues de pedir token', tokenData);

 logRemote('🧪 despues de pedir token', tokenData);

 logRemote('📲 Expo Push Token', tokenData?.data);

 const expoPushToken = tokenData?.data;

 if (!expoPushToken) {
  console.log('🚫 No se obtuvo Expo Push Token');
  return;
 }

 console.log('📲 Expo Push Token:', expoPushToken);

 await api.post('register_push_tokens.php', {
  token: expoPushToken,
  user_id: userId ?? null,
  platform: Platform.OS,
 });

 console.log('✅ Push token enviado al backend');
}
