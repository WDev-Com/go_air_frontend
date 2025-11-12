import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import { createFlight } from "./adminSlice";
import { useDispatch } from "react-redux";

const airlinesList = ["IndiGo", "Air India", "Vistara", "SpiceJet", "Go Air"];
const stops = [0, 1];
const bookingTypes = ["REFUNDABLE", "NON_REFUNDABLE"];
const departureTypes = ["EARLY_MORNING", "MORNING", "AFTERNOON", "LATE"];
const specialFareTypes = [
  "REGULAR",
  "STUDENT",
  "ARMED_FORCES",
  "SENIOR_CITIZEN",
  "DOCTOR_AND_NURSES",
  "FAMILY",
];
const aircraftSizes = ["LIGHT", "MEDIUM", "LARGE", "JUMBO"];

const CreateFlightPage = () => {
  const [formData, setFormData] = useState({
    airline: "",
    flightNumber: "",
    sourceAirport: "",
    destinationAirport: "",
    destinationStop: "",
    departureDate: "",
    arrivalDate: "",
    departureTime: "",
    arrivalTime: "",
    boardingTime: "",
    stop: "",
    durationMinutes: "",
    price: "",
    availableSeats: "",
    bookingType: "",
    departureType: "",
    aircraftSize: "",
    specialFareType: "",
  });

  const dispatch = useDispatch();
  const [error, setError] = useState("");

  useEffect(() => {
    if (formData.departureTime && formData.arrivalTime) {
      const dep = new Date(`1970-01-01T${formData.departureTime}:00`);
      const arr = new Date(`1970-01-01T${formData.arrivalTime}:00`);
      let diff = (arr - dep) / (1000 * 60);
      if (diff < 0) diff += 24 * 60;
      setFormData((prev) => ({ ...prev, durationMinutes: diff }));
    }
  }, [formData.departureTime, formData.arrivalTime]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError("");
  };

  const requiredFields = [
    "airline",
    "flightNumber",
    "sourceAirport",
    "destinationAirport",
    "departureDate",
    "arrivalDate",
    "departureTime",
    "arrivalTime",
    "boardingTime",
    "price",
    "availableSeats",
    "bookingType",
    "departureType",
    "aircraftSize",
  ];

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (let field of requiredFields) {
        if (!formData[field]) {
          setError(`⚠️ Please fill out the "${field}" field.`);
          return;
        }
      }
      await dispatch(createFlight(formData)).unwrap();
      setSnackbar({
        open: true,
        message: "Flight created successfully!",
        severity: "success",
      });
      setFormData({
        airline: "",
        flightNumber: "",
        sourceAirport: "",
        destinationAirport: "",
        destinationStop: "",
        departureDate: "",
        arrivalDate: "",
        departureTime: "",
        arrivalTime: "",
        boardingTime: "",
        stop: "",
        durationMinutes: "",
        price: "",
        availableSeats: "",
        bookingType: "",
        departureType: "",
        aircraftSize: "",
        specialFareType: "",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error}`,
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        ✈️ Create New Flight
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Airline */}
            <Grid item xs={12} md={4}>
              <FormControl sx={{ width: 130 }} required>
                <InputLabel>Airline</InputLabel>
                <Select
                  value={formData.airline}
                  onChange={(e) => handleChange("airline", e.target.value)}
                  input={<OutlinedInput label="Airline" />}
                >
                  {airlinesList.map((airline) => (
                    <MenuItem key={airline} value={airline}>
                      {airline}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Flight Number */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Flight Number"
                fullWidth
                value={formData.flightNumber}
                onChange={(e) => handleChange("flightNumber", e.target.value)}
                required
              />
            </Grid>

            {/* Source Airport */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Source Airport"
                fullWidth
                value={formData.sourceAirport}
                onChange={(e) => handleChange("sourceAirport", e.target.value)}
                required
              />
            </Grid>

            {/* Destination Airport */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Destination Airport"
                fullWidth
                value={formData.destinationAirport}
                onChange={(e) =>
                  handleChange("destinationAirport", e.target.value)
                }
                required
              />
            </Grid>

            {/* Destination Stop */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Destination Stop"
                fullWidth
                value={formData.destinationStop}
                onChange={(e) =>
                  handleChange("destinationStop", e.target.value)
                }
              />
            </Grid>

            {/* Stops */}
            <Grid item xs={12} md={4}>
              <FormControl sx={{ width: 100 }}>
                <InputLabel>Stops</InputLabel>
                <Select
                  value={formData.stop}
                  onChange={(e) => handleChange("stop", e.target.value)}
                  input={<OutlinedInput label="Stops" />}
                >
                  {stops.map((stop) => (
                    <MenuItem key={stop} value={stop}>
                      {stop}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Dates */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Departure Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.departureDate}
                onChange={(e) => handleChange("departureDate", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Arrival Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.arrivalDate}
                onChange={(e) => handleChange("arrivalDate", e.target.value)}
                required
              />
            </Grid>

            {/* Times */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Boarding Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.boardingTime}
                onChange={(e) => handleChange("boardingTime", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Departure Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.departureTime}
                onChange={(e) => handleChange("departureTime", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Arrival Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.arrivalTime}
                onChange={(e) => handleChange("arrivalTime", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Duration (Minutes)"
                type="number"
                fullWidth
                value={formData.durationMinutes}
                disabled
              />
            </Grid>

            {/* Seats & Price */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Available Seats"
                type="number"
                fullWidth
                value={formData.availableSeats}
                onChange={(e) => handleChange("availableSeats", e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </Grid>

            {/* Booking Type */}
            <Grid item xs={12} md={4}>
              <FormControl sx={{ width: 150 }} required>
                <InputLabel>Booking Type</InputLabel>
                <Select
                  value={formData.bookingType}
                  onChange={(e) => handleChange("bookingType", e.target.value)}
                  input={<OutlinedInput label="Booking Type" />}
                >
                  {bookingTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Departure Type */}
            <Grid item xs={12} md={4}>
              <FormControl sx={{ width: 155 }} required>
                <InputLabel>Departure Type</InputLabel>
                <Select
                  value={formData.departureType}
                  onChange={(e) =>
                    handleChange("departureType", e.target.value)
                  }
                  input={<OutlinedInput label="Departure Type" />}
                >
                  {departureTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Aircraft Size */}
            <Grid item xs={12} md={4}>
              <FormControl sx={{ width: 140 }} required>
                <InputLabel>Aircraft Size</InputLabel>
                <Select
                  value={formData.aircraftSize}
                  onChange={(e) => handleChange("aircraftSize", e.target.value)}
                  input={<OutlinedInput label="Aircraft Size" />}
                >
                  {aircraftSizes.map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Special Fare */}
            <Grid item xs={12} md={4}>
              <FormControl sx={{ width: 175 }}>
                <InputLabel>Special Fare Type</InputLabel>
                <Select
                  value={formData.specialFareType}
                  onChange={(e) =>
                    handleChange("specialFareType", e.target.value)
                  }
                  input={<OutlinedInput label="Special Fare Type" />}
                >
                  {specialFareTypes.map((fare) => (
                    <MenuItem key={fare} value={fare}>
                      {fare}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {/* Submit */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 3 }}
                fullWidth
              >
                Create Flight
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateFlightPage;

/* Error Message when submitting the form fix it when possible: 09-Jun-2025
MUI: A component is changing the controlled value state of Select to be uncontrolled.
Elements should not switch from uncontrolled to controlled (or vice versa).
Decide between using a controlled or uncontrolled Select element for the lifetime of the component.
The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.
More info: https://fb.me/react-controlled-components
*/
