import {createRouter, createWebHistory, useRoute} from "vue-router";
import SignUp from "./views/SignUp.vue";
import SignIn from "./views/SignIn.vue";
import Game from "./views/Game.vue";
import UserProfile from "./views/UserProfile.vue";
import ManageGame from "./views/ManageGame.vue";
import Home from "./views/Home.vue";
import SignOut from "./views/SignOut.vue";
import {ref, watchEffect} from "vue";
import useAuthStore from "./stores/auth.js";
import api from './api.js';

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            guard: "guest"
        }
    },
    {
        path: "/sign-up",
        name: "SignUp",
        component: SignUp,
        meta: {
            guard: "guest"
        }
    },
    {
        path: "/sign-in",
        name: "SignIn",
        component: SignIn,
        meta: {
            guard: "guest"
        }
    },
    {
        path: "/sign-out",
        name: "SignOut",
        component: SignOut,
        meta: {
            guard: "guest"
        }
    },
    {
        path: "/game/:id",
        name: "Game",
        component: Game,
        meta: {
            guard: "auth"
        }
    },
    {
        path: "/user/:id",
        name: "UserProfile",
        component: UserProfile,
        meta: {
            guard: "auth"
        }
    },
    {
        path: "/user/:id/manage/:gameId",
        name: "ManageGame",
        component: ManageGame,
        meta: {
            guard: "auth"
        }
    },


];
let route = useRoute();
const router = createRouter({
    history: createWebHistory(),
    routes
});
const game = ref({});

async function getGame() {
    console.log(route.params.id);
    let {data} = await api.get(`games/${route.params.id}`);
    game.value = data;

}

//setup middleware
router.beforeEach(async (to, from, next) =>{
    const authStore  = useAuthStore();

    //if already logged in or registered redirect back to the home page
    if((to.name === "SignIn"|| to.name === "SignUp") && authStore.isValidated){
        next({name: "Home"});
    }else if(to.meta.guard === "auth" && !authStore.isValidated){
        //if trying to access routes with auth  guard
        next({name: "Sign In"});
    }else if(to.name === "ManageGame"){
        //check for whether is the author or not
        await getGame();
        next();

    }
    next();
});

export default router;