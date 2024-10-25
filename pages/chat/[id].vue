<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="p-10">
    roomId：{{ route.params.id }}
  </div>
</template>
