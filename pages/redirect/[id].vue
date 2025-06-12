<script setup lang="ts">
const { getLineToken } = useLine();
const { getGithubToken } = useGithub();
const route = useRoute();
const router = useRouter();

onBeforeMount(async() => {
  // 判斷使用來源登入 
  if(!route.query.code){
    router.push("/login");
    return;
  }

  switch (route.params.id) {
    case "line":
      await getLineToken();
      break;
    case "github":
      await getGithubToken();
      break;
    default:
      break;
  }
});

</script>

<template>
  <div>
    Loading...
  </div>
</template>