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

getGame();
async function getGame() {
  let {data} = await api.get(`games/${route.params.gameId}`);
  game.value = data;

}

async function updateGame(){
  await api.put(`games/${route.params.gameId}`, {

  });
}
</script>

<template>
  <section aria-label="Section Manage Game">
    <h1 class="text-center mb-4 text-nowrap">Manage Game</h1>

    <article  class="mb-3 bg-dark text-decoration-none game-card d-flex  flex-nowrap flex-row  gap-3 card shadow-lg p-3">
      <img v-if="game.thumbnail" :src="'http://ws01.worldskills.org/wsc2022_module_c/public/' + game.thumbnail" :alt="'Image Thumbnail of ' + game.title">
      <img v-else src="/default.jpg" alt="Default Thumbnail">
      <div class="game-card-body flex-grow-1 d-flex flex-column justify-content-between">
        <form action="#" class="mb-3" @submit.prevent="updateGame">
          <input type="text" class="mb-2 form-control" :value="game.title" required>
          <textarea rows="14" cols="40"  class="mb-2 form-control" required>
            {{game.description}}
          </textarea>

          <button type="submit" class="btn btn-light">Update</button>
        </form>

      </div>

    </article>
    <div class="game-card-footer d-flex gap-3 mb-5">
      <button class="btn btn-dark" @click="uploadNewVersion">Upload New Version</button>
      <button class="btn btn-outline-dark" @click="deleteGame">Delete</button>
    </div>
  </section>
</template>

<style scoped>


.game-card > img{
  width: 450px;
  flex: 0 1 250px;
  height: 400px;
  object-fit: cover;
}
</style>