import axios from 'axios';
import useAuthStore from "./stores/auth.js";
import router from './router.js';

const api = axios.create({
    baseURL: "http://ws01.worldskills.org/wsc2022_module_c/public/api/v1",
});

//setup interceptors here
api.interceptors.request.use((config)=>{
    const authStore = useAuthStore();

    if(authStore.isValidated){
        api.defaults.headers = {
            "Authorization" : `Bearer ${authStore.token}`,
        }
    }
    return config;
}, error => {
    console.error(error);

    return Promise.reject(error);
});

api.interceptors.response.use((config)=>{
    return config;
}, error => {
    console.error(error);
    const authStore = useAuthStore();
    //if the error is 401, reset the token and username and notify user to login or signup again
    if(error.response.status === 401){
        alert("Your session has expired, please login again");
        authStore.username = null;
        authStore.token = null;

        //redirect to login page
        router.push({name: "SignIn"});
    }
    return Promise.reject(error);
});

export default api;