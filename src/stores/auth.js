import {defineStore} from 'pinia';
import {watchEffect ,ref, computed} from "vue";

const useAuthStore = defineStore("auth", ()=>{
//     states
    const token = ref(localStorage.getItem("token")|| null);
    const username = ref(localStorage.getItem("username")|| null);


    watchEffect(()=>{
        localStorage.setItem("token",token.value);
        localStorage.setItem("username",username.value);
    });
//     getters
    const isValidated = computed( ()=>{
        return !!token.value && !!username.value && token.value != 'null'  && username.value != 'null' ;
    });

//     actions


    return{
        token,
        username,
        isValidated,
    }
});

export default useAuthStore;