import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  //baseURL: 'http://192.168.0.146/loa_school',
  baseURL: 'https://school.loasurf.com.ar/',
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

/*api.interceptors.response.use(response => {
  console.log(JSON.stringify(response.config))
  console.log(JSON.stringify(response.headers))
  console.log(JSON.stringify(response.data));
  return response
}) */

export default api;
