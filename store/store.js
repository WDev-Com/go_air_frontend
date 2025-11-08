import { configureStore, createReducer } from "@reduxjs/toolkit";
import authReducer from "../src/auth/authSlice";
import adminReducer from "../src/admin_service/adminSlice";
import userReducer from "../src/user_service/userSlice";
const store = configureStore({
  reducer: { auth: authReducer, user: userReducer, admin: adminReducer },
});

export default store;
