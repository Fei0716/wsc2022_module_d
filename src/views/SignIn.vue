<script setup>
import {ref, watchEffect} from "vue";
import useAuthStore from "../stores/auth.js";
import api from './../api.js';
import router from './../router.js';

//states
const authStore = useAuthStore();
const username = ref(null);
const password = ref(null);
const usernameError = ref(null);
const passwordError = ref(null);

//functions

async function signin(){
  try{
    const {data} = await api.post("auth/signin",{
      username: username.value,
      password: password.value,
    });
    //store the token and username
    authStore.token = data.token;
    authStore.username = data.username;

    await router.push({name: "Home"});

  }catch(e){
    if(e.response.data?.violations?.username){
      usernameError.value = e.response.data.violations.username[0];
    }
    if (e.response.data.message){
      usernameError.value = e.response.data.message;
    }
    if(e.response.data?.violations?.password){
      passwordError.value = e.response.data.violations.password[0];
    }

  }
}
</script>

<template>
<!--form section-->

  <section aria-label="Section Form Sign In" >
    <h1 class="text-center mb-3">Sign In</h1>
    <form action="#" @submit.prevent="signin" class="card shadow-sm p-3" id="form">
      <div class="mb-2">
        <label for="username">Username</label>
        <input type="text" class="form-control" :class="{'is-invalid': usernameError}" name="username" id="username" v-model="username" required>

        <div v-if="usernameError" class="invalid-feedback">
          {{usernameError}}
        </div>
      </div>

      <div class="mb-3">
        <label for="password">Password</label>
        <input type="password" class="form-control" :class="{'is-invalid': passwordError}" name="password" id="password" v-model="password" required>
        <div v-if="passwordError" class="invalid-feedback">
          {{passwordError}}
        </div>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-dark flex-grow-1">Sign In</button>
        <button type="reset" class="btn btn-outline-dark flex-grow-1">Reset</button>
      </div>
    </form>
  </section>
</template>

<style scoped>

</style>