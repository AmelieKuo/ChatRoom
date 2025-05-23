<script lang="ts" setup>
const props = defineProps<{
  validatorError: boolean;
  message: string;
}>();

const isError = toRef(props, 'validatorError');
</script>

<template>
  <p v-show="isError" class="pt-[5px] text-[12px] w-full text-[#d03050] text-left">
    {{ message }}
  </p>
</template>
