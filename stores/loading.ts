import { defineStore } from "pinia";

export const useLoadingStore = defineStore("auth", () => {

  const loadingArr = ref<Array<any>>([]);

  const hasLoading = computed(() => {
    return loadingArr.value.length > 0;
  });

  const addLoading = (loadingId: string) => {
    loadingArr.value.push(loadingId);
  };

  const removeLoading = (loadingId: string) => {
    loadingArr.value = loadingArr.value.filter(id => id !== loadingId);
  };


  return {
    hasLoading,
    loadingArr,
    addLoading,
    removeLoading
  };
});