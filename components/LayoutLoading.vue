<script lang="ts" setup>
// const { LoadingStore } = useStore()
const loading = ref(false);
</script>

<template>
  <transition name="fade">
    <section v-if="loading">
      loading...
    </section>
  </transition>
</template>
