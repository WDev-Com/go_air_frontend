// src/redux/userSlice.jsx
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchFlightsAPI,
  getUserByUsernameAPI,
  getFlightByNumberAPI,
  bookFlightAPI,
  getSeatsByFlightNumberAPI,
} from "./userAPI";

// ✅ Fetch seats by flight number
export const fetchSeatsByFlightNumber = createAsyncThunk(
  "user/fetchSeatsByFlightNumber",
  async (flightNumber, { rejectWithValue }) => {
    try {
      const data = await getSeatsByFlightNumberAPI(flightNumber);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Fetch user details
export const fetchUserByUsername = createAsyncThunk(
  "user/fetchUserByUsername",
  async (username, { rejectWithValue }) => {
    try {
      const data = await getUserByUsernameAPI(username);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Fetch flight details
export const fetchFlightByNumber = createAsyncThunk(
  "user/fetchFlightByNumber",
  async (flightNumber, { rejectWithValue }) => {
    try {
      const data = await getFlightByNumberAPI(flightNumber);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ✅ Book flight
export const bookFlight = createAsyncThunk(
  "user/bookFlight",
  async ({ userID, bookingData }, { rejectWithValue }) => {
    try {
      const data = await bookFlightAPI(userID, bookingData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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
    userDetails: null,
    flightDetails: null,
    bookingResponse: null,
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
        state.flights = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ----- Fetch User -----
      .addCase(fetchUserByUsername.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- Fetch Flight -----
      .addCase(fetchFlightByNumber.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFlightByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.flightDetails = action.payload;
      })
      .addCase(fetchFlightByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----- Book Flight -----
      .addCase(bookFlight.pending, (state) => {
        state.loading = true;
        state.bookingResponse = null;
      })
      .addCase(bookFlight.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingResponse = action.payload;
      })
      .addCase(bookFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ----- Fetch Seats -----
      .addCase(fetchSeatsByFlightNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeatsByFlightNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeatsByFlightNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
export const selectFlights = (state) => state.user.flights;
export const selectLoading = (state) => state.user.loading;
export const selectError = (state) => state.user.error;
export const selectUserDetails = (state) => state.user.userDetails;
export const selectFlightDetails = (state) => state.user.flightDetails;
export const selectBookingResponse = (state) => state.user.bookingResponse;
export const selectSeats = (state) => state.user.seats;
