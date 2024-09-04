<script setup>
import {RouterView} from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>

  <NavBar></NavBar>
  <main role="main" class="container mt-5">
    <RouterView></RouterView>
  </main>
</template>

<style scoped>

</style>
