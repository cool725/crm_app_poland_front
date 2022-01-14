import axios from 'axios';
import storage from "./storage";
import { BASE_URL } from './config';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';


// set base url
axios.defaults.baseURL = BASE_URL;

// attach authorization token to header
axios.interceptors.request.use(
  config => {
    const token = storage.getToken();
    if (token) {
      config.headers['authorization'] = token;
    }
    return config;
  },
  error => {
    Promise.reject(error)
  }
);

// normalize response
axios.interceptors.response.use(response => {
  return response;
}, async (err) => {
  if (err?.response?.data?.message) {
    message.error(err.response.data.message);
  }

  // Access Token was expired
  if (err?.response.status === 401) {
    storage.removeToken();

    const navigate = useNavigate();
    navigate('/login');
  }

  return Promise.reject(err);
});