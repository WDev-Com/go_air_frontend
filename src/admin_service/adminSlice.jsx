import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllFlightsAPI,
  createFlightAPI,
  getFlightByNumberAPI,
  updateFlightAPI,
  deleteFlightAPI,
  generateSeatsAPI,
  getSeatsByFlightNumberAPI,
} from "./adminAPI";

// === Async Thunks ===

// Flights
export const fetchFlights = createAsyncThunk(
  "admin/fetchFlights",
  async (filters, { rejectWithValue }) => {
    try {
      return await fetchAllFlightsAPI(filters);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createFlight = createAsyncThunk(
  "admin/createFlight",
  async (flight, { rejectWithValue }) => {
    try {
      return await createFlightAPI(flight);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFlightByNumber = createAsyncThunk(
  "admin/getFlightByNumber",
  async (flightNumber, { rejectWithValue }) => {
    try {
      return await getFlightByNumberAPI(flightNumber);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFlight = createAsyncThunk(
  "admin/updateFlight",
  async ({ flightNumber, flight }, { rejectWithValue }) => {
    try {
      return await updateFlightAPI(flightNumber, flight);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFlight = createAsyncThunk(
  "admin/deleteFlight",
  async (flightNumber, { rejectWithValue }) => {
    try {
      return await deleteFlightAPI(flightNumber);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Seats
export const generateSeats = createAsyncThunk(
  "admin/generateSeats",
  async (flightNo, { rejectWithValue }) => {
    try {
      return await generateSeatsAPI(flightNo);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSeatsByFlightNumber = createAsyncThunk(
  "admin/getSeatsByFlightNumber",
  async (flightNumber, { rejectWithValue }) => {
    try {
      return await getSeatsByFlightNumberAPI(flightNumber);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// === Slice ===
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    flights: [],
    totalElements: 0,
    selectedFlight: null,
    seats: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === Fetch All Flights ===
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Fetched Flights:", action.payload);
        state.flights = action.payload.flights; // only store the array
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Create Flight ===
      .addCase(createFlight.fulfilled, (state, action) => {
        state.flights.push(action.payload);
        state.message = "Flight created successfully.";
      })
      .addCase(createFlight.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === Get Flight By Number ===
      .addCase(getFlightByNumber.fulfilled, (state, action) => {
        state.selectedFlight = action.payload;
      })
      .addCase(getFlightByNumber.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === Update Flight ===
      .addCase(updateFlight.fulfilled, (state, action) => {
        const index = state.flights.findIndex(
          (f) => f.flightNumber === action.payload.flightNumber
        );
        if (index !== -1) state.flights[index] = action.payload;
        state.message = "Flight updated successfully.";
      })
      .addCase(updateFlight.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === Delete Flight ===
      .addCase(deleteFlight.fulfilled, (state, action) => {
        state.flights = state.flights.filter(
          (f) => f.flightNumber !== action.meta.arg
        );
        state.message = action.payload;
      })
      .addCase(deleteFlight.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === Generate Seats ===
      .addCase(generateSeats.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(generateSeats.rejected, (state, action) => {
        state.error = action.payload;
      })

      // === Get Seats ===
      .addCase(getSeatsByFlightNumber.fulfilled, (state, action) => {
        state.seats = action.payload;
      })
      .addCase(getSeatsByFlightNumber.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = adminSlice.actions;
// === Selectors ===
export const selectFlights = (state) => state.admin.flights;
export const selectTotalElements = (state) => state.admin.totalElements;
export const selectSelectedFlight = (state) => state.admin.selectedFlight;
export const selectSeats = (state) => state.admin.seats;
export const selectLoading = (state) => state.admin.loading;
export const selectError = (state) => state.admin.error;
export const selectMessage = (state) => state.admin.message;

export default adminSlice.reducer;
