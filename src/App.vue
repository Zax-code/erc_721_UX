<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div id="root">
    <nav>
      <ul>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li><RouterLink to="/chain-info">Chain Info</RouterLink></li>
        <li><RouterLink to="/fakeBAYC">Fake BAYC</RouterLink></li>
        <li><RouterLink to="/fakeNefturians">Fake Nefturians</RouterLink></li>
        <li><RouterLink to="/fakeMeebits">Fake Meebits</RouterLink></li>
      </ul>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
#root {
  width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
/*Make the nav bar pretty in a dark theme*/
nav ul {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
nav li {
  display: inline-block;
  padding: 0.5rem 1rem;
}
nav a {
  color: #f2f2f2;
  text-decoration: none;
  font-size: 1.2rem;
}
nav a:hover {
  color: #ddd;
}
/*Make the nav bar more visible in a dark theme*/
nav {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #b8bfd6;
}
</style>
