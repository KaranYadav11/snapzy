import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    onlineUsers: [],
    messages: [],
    count: 0,
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    clearCount: (state) => {
      state.count = 0;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.count = state.count + 1;
    },
  },
});
export const { setOnlineUsers, clearCount, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
