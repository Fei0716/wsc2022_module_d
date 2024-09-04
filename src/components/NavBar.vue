<script setup>
import {ref, watchEffect, watch} from "vue";
import useAuthStore from "../stores/auth.js";
import api from './../api.js';
import router from "../router.js";
import auth from "../stores/auth.js";

const authStore = useAuthStore();
async function logout(){
    await api.post("auth/signout");

    //remove the token and username
    authStore.token = null;
    authStore.username = null;

    // Remove the token and username from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    await router.push({name: "SignOut"});
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand text-white " :to="{name: 'Home'}"> <h2 class="h4 my-auto">WorldSkill: Games</h2> </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse d-flex justify-content-end" id="navbarNavDropdown">
<!--        if authenticated-->
        <ul class="navbar-nav d-flex gap-2">
          <template v-if=" authStore.isValidated ">
              <li class="nav-item d-flex gap-2 align-items-center">
                  <strong class="text-white">{{authStore.username}}</strong>
                  <button class="btn btn-light" @click="logout">Logout</button>
              </li>
          </template>
          <template v-else>
            <li class="nav-item">
              
              <RouterLink :to="{name: 'SignUp'}">
                <button class="btn btn-light" @submit="signup">Sign Up</button>
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink :to="{name: 'SignIn'}">
                <button class="btn btn-light" @submit="signin">Sign In</button>
              </RouterLink>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>