import { configureStore, createReducer } from "@reduxjs/toolkit";
import authReducer from "../src/auth/authSlice";
import userReducer from "../src/user_service/userSlice";
const store = configureStore({
  reducer: { auth: authReducer, user: userReducer },
});

export default store;
