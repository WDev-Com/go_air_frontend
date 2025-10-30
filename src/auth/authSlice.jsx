import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, signupUser, signOutUser } from "./authAPI";

const initialState = {
  user: null,
  jwtToken: null,
  refreshToken: null,
  role: null,
  status: "idle",
  error: null,
};

// =============== Thunks ===============
export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async (loginInfo, { rejectWithValue }) => {
    try {
      const response = await loginUser(loginInfo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const signupUserAsync = createAsyncThunk(
  "auth/signupUser",
  async (signupInfo, { rejectWithValue }) => {
    try {
      const response = await signupUser(signupInfo);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Signup failed");
    }
  }
);

export const signOutUserAsync = createAsyncThunk(
  "auth/signOutUser",
  async () => {
    const response = await signOutUser();
    return response.data;
  }
);

// =============== Slice ===============
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------- LOGIN ----------
      .addCase(loginUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.username;
        state.jwtToken = action.payload.jwtToken;
        state.refreshToken = action.payload.refreshToken;
        state.role = action.payload.role;
        state.error = null;
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })

      // ---------- SIGNUP ----------
      .addCase(signupUserAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.user = action.payload.userID;
        state.error = null;
      })
      .addCase(signupUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })

      // ---------- SIGNOUT ----------
      .addCase(signOutUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signOutUserAsync.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.jwtToken = null;
        state.refreshToken = null;
        state.role = null;
        state.error = null;
      });
  },
});

// =============== Selectors ===============
export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectJwtToken = (state) => state.auth.jwtToken;
export const selectUserRole = (state) => state.auth.role;

export default authSlice.reducer;
