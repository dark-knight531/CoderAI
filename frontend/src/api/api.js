import axios from 'axios';

const api = axios.create({
    baseURL: 'https://coderai-whwm.onrender.com',
    withCredentials: true,
})

export default api;