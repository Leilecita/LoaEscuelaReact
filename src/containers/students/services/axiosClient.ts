import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.0.234/loa_school',
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    console.log('TOKEN para request:', token);  
    if (token) {
      config.headers['Session'] = token; // <-- Esto agrega la cabecera 'Session'
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
