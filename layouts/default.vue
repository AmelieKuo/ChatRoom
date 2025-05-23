<script lang="ts" setup></script>

<template>
  <section class="w-full h-[100vh] flex justify-center items-center bg-[#F4F4F4]">
    <LayoutLoading />
    <div class="w-full max-w-[600px] h-auto">
      <slot />
    </div>
  </section>
</template>
