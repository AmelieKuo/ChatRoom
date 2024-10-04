<script lang="ts" setup>
import { FETCH_AUTH } from '@/api';

async function getAuth() {
  const query = {
    page: 1
  }
  const { data = [] } = await FETCH_AUTH.Test(query);
  console.log(data)
}

onMounted(() => {
  getAuth()
})


</script>


<template>
  <div>
    index
  </div>
</template>
