<script lang="ts" setup>
import { createDiscreteApi } from "naive-ui";
import type { joinChatRoomRequestBody } from "~~/api/types";
import type { FormInst, FormRules } from "naive-ui";
const { FETCH_CHAT } = useApi();

const router = useRouter();
const useModal = createDiscreteApi(["modal"]);
const { modal } = useModal;

const useAuth = useAuthStore();
const { userProfile } = storeToRefs(useAuth);

const loginToken = useCookie("roomToken");

const formRef = ref<FormInst | null>(null);
const formData = ref<joinChatRoomRequestBody>({
  chatRoomCode: "",
  chatRoomPassword: "",
});

 const rules: FormRules = {
  chatRoomCode: [
    { required: true, message: "必填" },
  ],
  chatRoomPassword: [
    { required: true, message: "必填" },
  ],
};

/** @func 進入聊天室 */ 
const handleClick = async() => {
    await formRef.value.validate(async(errors) => {
        if (!errors) {
            console.log(formData.value);

            const { message, success, data } = await FETCH_CHAT.Join(formData.value); 

            const currentModal = modal.create({
                title: message,
                preset: "dialog",
            });

            if (success) {
                setTimeout(() => {
                    currentModal.destroy();
                    router.push(`/chat/${data}`);
                }, 3000);
            } else {
              console.log("createRoom");
            }
        } else {
            console.log(errors);
        }
    });
};

onMounted(() => {});
</script>

<template>
  <div
    class="flex flex-col gap-[20px] justify-center items-center bg-white p-5 min-h-screen md:min-h-fit"
  >
    <div
      class="rounded-full border border-4 border-[#63e2b7] overflow-hidden w-[60%]"
    >
      <img
        v-if="userProfile.picture"
        :src="userProfile.picture"
      >
      <img
        v-else
        src="/image/defalut_headshot.jpg"
        alt=""
        class="w-full h-full object-cover"
      >
    </div>
    <p class="font-bold text-[28px] w-full">
      Hi! {{ userProfile.name }}
    </p>

      <n-form ref="formRef" :model="formData" :rules="rules" :show-label="false" class="w-full">
        <n-form-item path="chatRoomCode">
          <n-input
            v-model:value="formData.chatRoomCode"
            placeholder="請輸入房號"
            type="text"
            autosize
            style="width: 100%; min-height: 50px"/>
        </n-form-item>
        <n-form-item path="chatRoomPassword">
          <n-input
            v-model:value="formData.chatRoomPassword"
            placeholder="請輸入密碼"
            type="text"
            autosize
            style="width: 100%; min-height: 50px"
          />
        </n-form-item>
     </n-form>
      <!-- <n-input
        v-model:value="requestBody.chatRoomCode"
        :status="inputStatus"
        placeholder="請輸入房號"
        type="text"
        autosize
        style="width: 100%; min-height: 50px"
        @input="validatorRoomID"
      >
        <template #suffix>
          <n-icon
            :component="Key16Filled"
            size="20"
          />
        </template>
      </n-input>
    <ValidationTip :validatorError="validatorRoomTip.error" :message="validatorRoomTip.message" />
    </div>

    <n-input
        v-model:value="requestBody.chatRoomPassword"
        :status="inputStatus"
        placeholder="請輸入密碼"
        type="text"
        autosize
        style="width: 100%; min-height: 50px"
        @input="validatorRoomID"
      >
        <template #suffix>
          <n-icon
            :component="Key16Filled"
            size="20"
          />
        </template>
      </n-input> -->

    <n-button
      type="primary"
      class="mt-[10px] w-full font-bold h-[50px]"
      @click="handleClick"
    >
      進入聊天室
    </n-button>
  </div>
</template>

<style></style>
