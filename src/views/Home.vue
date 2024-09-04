<script setup>
import {onMounted, ref, watchEffect, nextTick} from "vue";
import useAuthStore from "../stores/auth.js";
import api from './../api.js';
import router from './../router.js';
import {getjQuery} from "bootstrap/js/src/util/index.js";


//states
const sortOption = ref('popular');
const sortDir = ref('asc');

const games = ref([]);
const totalElements = ref(0);

let lastItem = null;
let observer;



getGames();
async function getGames(){
  let {data} =  await api.get(`games`);
  games.value.push(...data.content);
  if(totalElements.value === 0){
    totalElements.value = data.totalElements;
  }

  // Infinite scrolling setup
  await nextTick();
  //DOM is now updated
  lastItem = document.querySelector("#games-list > a:last-child");

  if(observer) observer.disconnect();

  observer = new IntersectionObserver(async (entries) => {
    if (entries[0].intersectionRatio > 0) {
      await getGames();
    }
  });
  if (lastItem) {
    observer.observe(lastItem);
  }
}

onMounted(()=>{
  //scroll to the top
  document.documentElement.scrollTop = 0;
})
</script>

<template>
  <section aria-label="Home Main Contents">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>{{totalElements}} Games available</h1>
<!--      sort options-->
      <div class="d-flex gap-1">
        <button class="btn" :class="{'btn-dark':sortOption === 'popular' }" @click="sortOption = 'popular'">Popularity</button>
        <button class="btn" :class="{'btn-dark':sortOption === 'uploaddate' }" @click="sortOption = 'uploaddate'">Recently Updated</button>
        <button class="btn" :class="{'btn-dark':sortOption === 'title' }" @click="sortOption = 'title'">Alphabetically</button>
      </div>
<!--      sort direction-->
      <div>
        <button class="btn" :class="{'btn-dark':sortDir === 'asc' }" @click="sortDir = 'asc'">ASC</button>
        <button class="btn" :class="{'btn-dark':sortDir === 'desc' }" @click="sortDir = 'desc'">DESC</button>
      </div>
    </div>
<!--    list of games-->
    <div id="games-list">
      <TransitionGroup name="game"  appear>
        <RouterLink v-for="(g,i) of games"  :key="g.slug" :to="{name: 'Game' , params: {id: g.slug}}" :aria-label="'Click to play '+ g.title " class="mb-5 bg-dark text-decoration-none game-card d-flex flex-nowrap flex-row  gap-3 card shadow-lg p-3">
          <img v-if="g.thumbnail" :src="'http://ws01.worldskills.org/wsc2022_module_c/public/' + g.thumbnail" :alt="'Image Thumbnail of ' + g.title">
          <img v-else src="/default.jpg" alt="Default Thumbnail">
          <div class="game-card-body">
            <h2 class="mb-2 text-white">{{g.title}} <span class="text-white-emphasis h4">by {{g.author}}</span></h2>
            <div class="mb-2 text-opacity-75 text-white"> <span class="h4 text-opacity-100">{{g.scoreCount}}</span> Scores Submitted</div>
            <p class="text-white">
              {{g.description}}
            </p>
          </div>
        </RouterLink>
      </TransitionGroup>

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
  .game-enter-active,
  .game-leave-active,
  .game-appear-active {
    transition: all 1s ease;
  }

  .game-enter-from,
  .game-leave-to,
  .game-appear-from {
    opacity: 0;
    transform: translateY(30px);
  }

  .game-enter-to,
  .game-leave-from,
  .game-appear-to {
    opacity: 1;
    transform: translateY(0);
  }
</style>