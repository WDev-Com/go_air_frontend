// src/redux/userSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchFlightsAPI } from "./userAPI";

export const fetchFlights = createAsyncThunk(
  "user/fetchFlights",
  async (params, { rejectWithValue }) => {
    try {
      const data = await searchFlightsAPI(params);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    flights: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Output : ", action.payload);
        state.flights = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
export const selectFlights = (state) => state.user.flights;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;
