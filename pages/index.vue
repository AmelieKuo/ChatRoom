<script lang="ts" setup>
import { createDiscreteApi } from "naive-ui";
import type { joinChatRoomRequestBody } from "~/services/types";
import type { FormInst, FormRules } from "naive-ui";

const { $api } = useNuxtApp() as any;
const { FETCH_CHAT } = $api;

const router = useRouter();
const useModal = createDiscreteApi(["modal"]);
const { modal } = useModal;

const useAuth = useAuthStore();
const { setUserProfile } = useAuth;
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

const showModal = ref(false)

/** @func 正式 Api 進入聊天室 */ 
const handleClick = async() => {
    if (!formRef.value) return;
    await formRef.value.validate(async(errors) => {
        if (!errors) {

            const resp = await FETCH_CHAT.Join({data:formData.value}); 

            const { resultCode: Code, errorMessage, message, error = false } = resp

            const msg = Code === '01' ? errorMessage : message

            const currentModal = modal.create({
                title: msg,
                preset: "dialog",
            });

            // 進入聊天室
            if (error || Code !== '01') {
                setTimeout(() => {
                    currentModal.destroy();
                    sessionStorage.setItem("roomKey", formData.value.chatRoomCode);
                    console.log(111);
                    router.push(`/chat/${formData.value.chatRoomCode}`);
                    console.log(222);
                }, 3000);

            // 新建聊天室
            } else {
              currentModal.destroy()             
              setTimeout(() => {
                  showModal.value = true
              }, 2000)
            }
        }
    });
};

/** @func 新建聊天室 */ 
const handleCreateRoom = async() => {
    createFormData.value.account = userProfile.value.account;
    const { resultCode, data, message } = await FETCH_CHAT.Create({data:createFormData.value}); 

    const currentModal = modal.create({
            title: message,
            preset: "dialog",
        });

        setTimeout(() => {
                currentModal.destroy();
                sessionStorage.setItem("roomKey", data.chatRoomCode);
                router.push(`/chat/${data.chatRoomCode}`);
            }, 3000);
};

/** @func 測試進入聊天室 */ 
const handleClickToRoom = async() => {
    if (!formRef.value) return;
    await formRef.value.validate(async(errors) => {
        if (!errors) {

          // 判斷匿名與房號是否有重複
          const oldNickname = sessionStorage.getItem(`nickname-${formData.value.chatRoomCode}`);

          if(oldNickname === formData.value.nickname){
            const currentModal = modal.create({
              title: "匿名名稱已存在，請先關閉其他聊天視窗再換匿名名稱",
              preset: "dialog",
            });
            currentModal.destroy();
            formData.value.nickname = "";
            return;
          }

          // 儲存匿名到 sessionStorage
          sessionStorage.setItem(`nickname-${formData.value.chatRoomCode}`, formData.value.nickname || userProfile.value.name);
          router.push(`/chat/${formData.value.chatRoomCode}`);
        }
    });
};

/** 表單驗證相關 */ 
const createFormRef = ref<FormInst | null>(null);
const createFormData = ref({
  account: "",
  chatRoomPassword: "",
  chatRoomName:"",
  description:"",
  nickname: "",
});

 const createFormRules: FormRules = {
  account: [
    { required: true, message: "必填" },
  ],
  chatRoomPassword: [
    { required: true, message: "必填" },
  ],
  chatRoomName:[
    { required: true, message: "必填" },
  ],
  description:[
    { required: true, message: "必填" },
  ],
  nickname: [
    { required: false },
  ],
};

/** 登出 */
const handleSignOut = async() => {
  loginToken.value = "";
  setUserProfile({});
  router.push("/login");
};

onMounted(() => {});
</script>

<template>
  <section>
    <div
      class="flex flex-col gap-[20px] justify-center items-center bg-white p-5 min-h-[100dvh] md:min-h-fit"
    >
      <div
        class="rounded-full border border-4 border-[#63e2b7] overflow-hidden w-[60%] max-w-[200px]"
      >
        <img
          v-if="userProfile.pic"
          :src="userProfile.pic"
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
          <n-form-item path="nickname">
            <n-input
              v-model:value="formData.nickname"
              placeholder="匿名名稱"
              type="text"
              autosize
              style="width: 100%; min-height: 50px"
            />
          </n-form-item>
          
          <n-form-item path="chatRoomCode">
            <n-input
              v-model:value="formData.chatRoomCode"
              placeholder="請輸入房號"
              type="text"
              autosize
              style="width: 100%; min-height: 50px"/>
          </n-form-item>
          
          <!-- <n-form-item path="chatRoomPassword">
            <n-input
              v-model:value="formData.chatRoomPassword"
              placeholder="請輸入密碼"
              type="text"
              autosize
              style="width: 100%; min-height: 50px"
            />
          </n-form-item> -->
       </n-form>
  
      <n-button
        type="primary"
        class="mt-[10px] w-full font-bold h-[50px]"
        @click="handleClickToRoom"
      >
        進入聊天室
      </n-button>

      <div
        class="mt-[3px] w-full font-bold h-[50px] text-center text-gray-300 hover:text-[#63e2b7] cursor-pointer"
        @click="handleSignOut"
      >
        登出
      </div>
    </div>
  
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="新建聊天室"
      positive-text="建立"
      negative-text="取消"
      @positive-click="handleCreateRoom"
      @negative-click="showModal = !showModal"
    >
    <n-form ref="createFormRef" :model="createFormData" :rules="createFormRules" :show-label="false" class="w-full">
          <n-form-item path="chatRoomCode">
            <n-input
              v-model:value="createFormData.chatRoomName"
              placeholder="請輸入房間名稱"
              type="text"
              autosize
              style="width: 100%; min-height: 50px"/>
          </n-form-item>
          <n-form-item path="chatRoomPassword">
            <n-input
              v-model:value="createFormData.chatRoomPassword"
              placeholder="請輸入房間密碼"
              type="text"
              autosize
              style="width: 100%; min-height: 50px"
            />
          </n-form-item>
           <n-form-item path="description">
            <n-input
              v-model:value="formData.description"
              placeholder="請輸入房間說明"
              type="text"
              autosize
              style="width: 100%; min-height: 50px"
            />
          </n-form-item>
       </n-form>
    </n-modal>
  </section>
</template>

<style></style>
