import { createSlice } from "@reduxjs/toolkit";

const notifySlice = createSlice({
  name: "notify",
  initialState: {
    notifications: [],
    hasFetched: false,
    count: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.count = 0;
      state.hasFetched = true;
    },
    pushNotification: (state, action) => {
      if (action.payload.type === "like" || action.payload.type === "follow") {
        state.notifications.unshift(action.payload);
        state.count = state.count + 1;
      } else if (
        action.payload.type === "dislike" ||
        action.payload.type === "unfollow"
      ) {
        if (state.count > 0) {
          state.count = state.count - 1;
        }
        state.notifications = state.notifications.filter(
          (item) => item.postId !== action.payload.postId
        );
      }
    },
    clearNotification: (state) => {
      state.notifications = [];
      state.hasFetched = false;
      state.count = 0;
    },
    clearCount: (state) => {
      state.count = 0;
    },
  },
});

export const {
  setNotifications,
  clearCount,
  clearNotification,
  pushNotification,
} = notifySlice.actions;
export default notifySlice.reducer;
