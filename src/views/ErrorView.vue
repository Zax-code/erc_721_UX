<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const error = route.params.error;
</script>

<template>
  <div>
    <h1>Error</h1>
    <p>
      {{ error }}
    </p>
  </div>
</template>
