import { createSlice } from "@reduxjs/toolkit";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: "",
  reducers: {
    updateSubscriptionStatus: (_state, action) => action.payload,
    clearSubscriptionStatus: () => ""
  },
});

export const { updateSubscriptionStatus, clearSubscriptionStatus } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;