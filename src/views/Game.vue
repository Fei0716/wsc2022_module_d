<script setup>
import {onMounted, ref, watchEffect, nextTick, watch, onUnmounted} from "vue";
import useAuthStore from "../stores/auth.js";
import api from './../api.js';
import router from './../router.js';
import {useRoute} from "vue-router";


//states
const game = ref({});
const scores = ref([]);
const authStore = useAuthStore();
const topScores = ref([]);
const userOutsideTopScores = ref({});

let route = useRoute();

getGame();
getScores();
async function getGame() {
  let {data} = await api.get(`games/${route.params.id}`);
  game.value = data;

}
async function getScores() {
  let {data} = await api.get(`games/${route.params.id}/scores`);
  scores.value = data.scores;

  //only get the top ten
  topScores.value = scores.value.slice( 0, 10);

  userOutsideTopScores.value = scores.value.find((s , i) => {

    return i >= 10 && s.username === authStore.username;
  });

  console.log(Object.keys(userOutsideTopScores).length);
}

function handleGameEnd(e){
  console.log(e);
}
//setup polling here
// lifecycle hooks
let pollInterval;
onMounted(()=>{
  pollInterval = setInterval(()=>{
    getScores();
  }, 5000);
  window.addEventListener("message" , handleGameEnd);
});
onUnmounted(() =>{
  clearInterval(pollInterval);
  window.removeEventListener("message" , handleGameEnd);
});
</script>

<template>
  <section aria-label=" Contents">
    <div class="mb-4">
      <h1 class="text-center mb-4 text-nowrap">{{game.title}}</h1>

      
<!--      game iframe here-->
      <article id="game-iframe" class="border border-1 border-dark-subtle rounded-1 shadow-lg mb-4">
        <iframe :src="'http://ws01.worldskills.org/wsc2022_module_c/public/'+ game.gamePath" frameborder="0"></iframe>
      </article>


<!--      game leaderboard here and description-->

      <div class="d-flex gap-2">
          <article class="w-50 bg-dark text-white  p-2">
            <h2 class="mb-2">Leaderboard</h2>
            <ol>
              <template v-for="(s, i) of topScores">
                <li class="p-2 border-bottom border-start border-1 border-light highlight d-flex justify-content-between align-items-center"  v-if="s.username === authStore.username"> <RouterLink class="text-white" :to="{name: 'UserProfile' , params: {id: s.username}}">{{s.username}}</RouterLink> <span>{{s.score}}</span></li>
                <li class="p-2 border-bottom border-start border-1 border-light d-flex justify-content-between align-items-center" v-else><RouterLink class="text-white" :to="{name: 'UserProfile' , params: {id: s.username}}">{{s.username}}</RouterLink><span>{{s.score}}</span></li>
              </template>
            </ol>
<!--            for user with score outside of top ten-->
            <div class="p-2" v-if="userOutsideTopScores && Object.keys(userOutsideTopScores)?.length > 0">
              {{userOutsideTopScores.username}} <span>{{userOutsideTopScores.score}}</span>
            </div>
          </article>

          <article class="w-50 bg-dark text-white p-2">
            <h2 class="mb-2">Description</h2>
            <p>{{game.description}}</p>
          </article>
      </div>
    </div>
  </section>
</template>

<style scoped>

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
#game-iframe{
  min-height: 500px;
  width: 100%;
}
.highlight{
  font-weight: bold;
  color: #e1b77c;
}
</style>