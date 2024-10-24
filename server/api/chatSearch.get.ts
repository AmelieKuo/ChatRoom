export default defineEventHandler(async(event) => {

  const paramURl = event.node.req.url
  const paramID = (paramURl.split('?')[1]).split('=')[1];

  const headers = getRequestHeaders(event);
  const userCookie = headers.cookie;

  // 假裝資料庫有的聊天室
  const chatList = [
    {
      id: "123",
      expDate: '2023-12-31',
      createDate: '2021-01-01',
      accountList: [ 'U123', 'U456',]
    },
    {
      id: "456",
      expDate: '2024-12-31',
      createDate: '2024-10-01',
      accountList: [ 'U123', 'U456',]
    },
    {
      id: "789",
      expDate: '2025-12-31',
      createDate: '2024-01-01',
      accountList: [ 'U123', 'U456',]
    },
];

  interface Response<T = any> {
    id?: string;
    success: boolean;
    message: string;
    data: T | null;
  }


  if(!headers.cookie || !userCookie){
    // 未登入
    const notLogin: Response<null> = {
      success: false,
      message: "未登入",
      data: null,
    };

    return notLogin;
  }

  if(chatList.find((chat) => chat.id === paramID && chat.accountList.includes(userCookie))){
    
    // 已有聊天室且曾經入座
    const hasRoom: Response<null> = {
      id: "be44ec2f-12c0-448b-a729-ac2c65bb6785",
      success: true,
      message: "前往聊天室",
      data: null,
    };

    return hasRoom;

  }else if(chatList.find((chat) => chat.id === paramID && chat.accountList.length < 2)){
    
    // 已有聊天室但未入座過
    const hasRoom: Response<null> = {
      id: "be44ec2f-12c0-448b-a729-ac2c65bb6785",
      success: true,
      message: "前往聊天室",
      data: null,
    };

    return hasRoom;
  }else{

    const newRoomID = await $fetch('/api/createChat', {
        method: 'GET',
      });

    // 無匹配聊天室
    const notFound: Response<null> = {
      success: false,
      message: "無匹配聊天室，將重新建立新聊天室",
      data: newRoomID,
    };

    return notFound;
  }   
});