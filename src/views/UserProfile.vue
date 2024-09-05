<script setup>
import {onMounted, ref, watchEffect, nextTick, watch, onUnmounted} from "vue";
import useAuthStore from "../stores/auth.js";
import api from './../api.js';
import router from './../router.js';
import {useRoute} from "vue-router";

//states
const game = ref({});
const authStore = useAuthStore();
const user = ref({});
const route = useRoute();

getUser();
async function getUser(){
  try{
      const {data} = await api.get(`users/${route.params.id}`);
      user.value = data;


  }catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <section aria-label="User Profile Section">
    <div class="mb-4">
      <h1 class="text-center mb-4 text-nowrap">{{user.username}}</h1>
      <article v-if="user?.authoredGames && Object.keys(user.authoredGames).length > 0">
          <h2 class="mb-2">Authored Games</h2>
          <div id="authored-games" class="mb-4">
            <RouterLink v-for="(g,i) of user.authoredGames"  :key="g.slug" :to="{name: 'Game' , params: {id: g.slug}}" :aria-label="'Click to play '+ g.title " class="mb-5 bg-dark text-decoration-none game-card d-flex  flex-nowrap flex-row  gap-3 card shadow-lg p-3">
              <img v-if="g.thumbnail" :src="'http://ws01.worldskills.org/wsc2022_module_c/public/' + g.thumbnail" :alt="'Image Thumbnail of ' + g.title">
              <img v-else src="/default.jpg" alt="Default Thumbnail">
              <div class="game-card-body flex-grow-1 d-flex flex-column justify-content-between">
                <div>
                  <h2 class="mb-2 text-white">{{g.title}}</h2>
                  <div class="mb-2 text-opacity-75 text-white text-end"> <span class="h4 text-opacity-100">{{g.scoreCount}}</span> Scores Submitted</div>
                  <p class="text-white">
                    {{g.description}}
                  </p>
                </div>
                <div class="game-card-footer align-self-end" v-if="user.username === authStore.username">
                  <RouterLink :to="{name:'ManageGame' , params:{id: user.username , gameId: g.slug}}" >
                    <button class="btn btn-light" >Manage Game</button>
                  </RouterLink>
                </div>
              </div>

            </RouterLink>
          </div>
      </article>

      <article>
        <h2 class="mb-2">Highscores per Game</h2>
        <ol class="list-group">
            <li class="list-group-item w-50" v-for="(s , i) of  user.highscores?.sort((a, b) => { a.game.title - b.game.title})">
              <RouterLink class="d-flex justify-content-between align-items-center text-dark" :to="{name: 'Game', params: {id: s.game.slug}}">
                {{s.game.title}} <span>{{s.score}}</span>
              </RouterLink>
            </li>
          </ol>
      </article>

    </div>
  </section>
</template>

<style scoped>
.highlight{
  font-weight: bold;
  color: #e1b77c;
}

.game-card > img{
  width: 450px;
  flex: 0 1 250px;
  height: 400px;
  object-fit: cover;
}
</style>