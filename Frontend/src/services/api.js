import axios from 'axios';


//custom axios pointing to  backend base URL
const API = axios.create({
    baseURL : 'http://localhost:5000/api'
,
headers: {
    'Content-Type': 'application/json',  //tells the im sending data as jsonformatted to the server
},
});

//request to automatically attach the token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;