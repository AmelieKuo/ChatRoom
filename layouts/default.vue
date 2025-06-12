<script lang="ts" setup></script>

<template>
  <section class="w-full h-100% flex justify-center items-center bg-[#F4F4F4] min-h-[100dvh]">
    <LayoutLoading />
    <div class="w-full max-w-[600px] h-100%">
      <slot />
    </div>
  </section>
</template>
