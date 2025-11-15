import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchFlightsAPI,
  getUserByUsernameAPI,
  getFlightByNumberAPI,
  bookFlightAPI,
  getSeatsByFlightNumberAPI,
  updateUserAPI,
  getUserBookings,
  getUserTickets,
  cancelBookingAPI,
} from "./userAPI";
import { toast } from "react-toastify";

// ✅ Cancel booking
export const cancelUserBooking = createAsyncThunk(
  "user/cancelUserBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const data = await cancelBookingAPI(bookingId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch user bookings
export const fetchUserBookings = createAsyncThunk(
  "user/fetchUserBookings",
  async (userID, { rejectWithValue }) => {
    try {
      if (!userID) return rejectWithValue("User ID not found");
      const data = await getUserBookings(userID);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Fetch user tickets for a booking
export const fetchUserTickets = createAsyncThunk(
  "user/fetchUserTickets",
  async (bookingId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const user = selectUserDetails(state);
      if (!user?.userID) return rejectWithValue("User ID not found");
      const data = await getUserTickets(user.userID, bookingId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Update user details
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ username, updatedData }, { rejectWithValue }) => {
    try {
      const data = await updateUserAPI(username, updatedData);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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
    bookings: [],
    tickets: [],
    seats: [],
    cancelResponse: null,
    showCancelModal: false,
    loading: false,
    error: null,
  },
  reducers: {
    closeCancelModal: (state) => {
      state.showCancelModal = false;
      state.cancelResponse = null;
    },
  },
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
        console.log("action.payload : ", action.payload);
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
      })

      // ----- Update User -----
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload; // update local state
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Tickets
      .addCase(fetchUserTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchUserTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // ✅ Cancel user booking
      .addCase(cancelUserBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelUserBooking.fulfilled, (state, action) => {
        state.loading = false;
        const cancelledId = action.payload.bookingId;
        state.cancelResponse = action.payload;
        state.showCancelModal = true;
        // ✅ Update booking status locally
        state.bookings = state.bookings.map((b) =>
          String(b.id) === String(cancelledId)
            ? { ...b, status: "CANCELLED" }
            : b
        );

        toast.success(
          action.payload.message || "Booking cancelled successfully"
        );
      })
      .addCase(cancelUserBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload || "Failed to cancel booking");
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
export const selectUserBookings = (state) => state.user.bookings;
export const selectUserTickets = (state) => state.user.tickets;
export const { closeCancelModal } = userSlice.actions;
