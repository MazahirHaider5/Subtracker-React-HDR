import axios from 'axios';
import { setError } from '../redux/action/index'; 
import { store } from '../redux/configureStore'; 

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, 
  withCredentials: true,
});
axiosInstance.interceptors.request.use(
  (config) => {
   
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    // console.log('Response received:', response);
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      console.log("from interceptor", response);

      switch (response.status) {
        case 401:
          store.dispatch(setError(401));
          break;
        case 403:
          store.dispatch(setError(`Error ${response.status}: ${response.data?.message}`));
          break;
        case 404:
          store.dispatch(setError(`Error ${response.status}: ${response.data?.message || 'Resource not found.'}`));
          break;
        case 500:
          store.dispatch(setError('Server Error: Please try again later.'));
          break;
        default:
          store.dispatch(setError(`Error ${response.status}: ${response.data?.message || 'An unexpected error occurred.'}`));
          break;
      }
    } else {
      store.dispatch(setError('Network Error: Please check your connection.'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

