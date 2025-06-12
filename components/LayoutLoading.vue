<script lang="ts" setup>
// const { LoadingStore } = useStore()
const loading = ref(false);
</script>

<template>
  <transition name="fade">
    <teleport to="body">
      <section
        v-if="loading"
        class="absolute top-0 left-0 w-full h-100% bg-white/70 z-2000 flex justify-center items-center flex-col"
      >
        <div class="loader" />
        Loading...
      </section>
    </teleport>
  </transition>
</template>

<style scoped>
.loader {
  width: 120px;
  height: 22px;
  border-radius: 20px;
  color: #18a058;
  border: 2px solid;
  position: relative;
}
.loader::before {
  content: "";
  position: absolute;
  margin: 2px;
  inset: 0 100% 0 0;
  border-radius: inherit;
  background: currentColor;
  animation: l6 2s infinite;
}
@keyframes l6 {
    100% {inset:0}
}
</style>
