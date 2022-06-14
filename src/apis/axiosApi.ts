import axios from 'axios'

axios.defaults.baseURL = '/api'
axios.interceptors.request.use(
    (config:any) => {
            config.headers.token = localStorage.getItem('Authorization');
        return config;
    },
    error => {
        return Promise.reject(error);
    });
export default axios