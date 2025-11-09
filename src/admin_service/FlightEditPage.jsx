import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFlightByNumber,
  updateFlight,
  generateSeats,
  selectSelectedFlight,
  selectLoading,
  selectError,
  selectMessage,
  clearMessage,
} from "./adminSlice";

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

const FlightEditPage = () => {
  const { flightNumber } = useParams(); // flightNumber
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const flight = useSelector(selectSelectedFlight);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const message = useSelector(selectMessage);

  const [formData, setFormData] = useState({
    flightNumber: "",
    airline: "",
    sourceAirport: "",
    destinationAirport: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    durationMinutes: "",
    price: "",
    availableSeats: "",
    bookingType: "",
    departureType: "",
    stop: 0,
    aircraftSize: "",
    specialFareType: "",
  });

  useEffect(() => {
    dispatch(getFlightByNumber(flightNumber));
  }, [dispatch, flightNumber]);
  // console.log(flight);
  useEffect(() => {
    if (flight) {
      setFormData(flight);
    }
  }, [flight]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    dispatch(updateFlight({ flightNumber: flightNumber, flight: formData }));
  };

  const handleGenerateSeats = () => {
    dispatch(generateSeats(flightNumber));
  };

  const handleBack = () => {
    navigate("/admin/dashboard");
  };

  const handleCloseSnackbar = () => {
    dispatch(clearMessage());
  };

  if (loading && !flight) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
      <Card sx={{ maxWidth: 900, mx: "auto", boxShadow: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            ✈️ Edit Flight - {flightNumber}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Flight Number"
                fullWidth
                value={formData.flightNumber}
                onChange={(e) => handleChange("flightNumber", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Airline"
                fullWidth
                value={formData.airline}
                onChange={(e) => handleChange("airline", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Source Airport"
                fullWidth
                value={formData.sourceAirport}
                onChange={(e) => handleChange("sourceAirport", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Destination Airport"
                fullWidth
                value={formData.destinationAirport}
                onChange={(e) =>
                  handleChange("destinationAirport", e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Departure Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.departureDate}
                onChange={(e) => handleChange("departureDate", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="time"
                label="Departure Time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.departureTime}
                onChange={(e) => handleChange("departureTime", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Arrival Date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.arrivalDate}
                onChange={(e) => handleChange("arrivalDate", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="time"
                label="Arrival Time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.arrivalTime}
                onChange={(e) => handleChange("arrivalTime", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Duration (Minutes)"
                fullWidth
                type="number"
                value={formData.durationMinutes}
                onChange={(e) =>
                  handleChange("durationMinutes", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Price (₹)"
                fullWidth
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Available Seats"
                fullWidth
                type="number"
                value={formData.availableSeats}
                onChange={(e) => handleChange("availableSeats", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Booking Type"
                fullWidth
                value={formData.bookingType || ""}
                onChange={(e) => handleChange("bookingType", e.target.value)}
              >
                {bookingTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Departure Type"
                fullWidth
                value={formData.departureType || ""}
                onChange={(e) => handleChange("departureType", e.target.value)}
              >
                {departureTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Aircraft Size"
                fullWidth
                value={formData.aircraftSize || ""}
                onChange={(e) => handleChange("aircraftSize", e.target.value)}
              >
                {aircraftSizes.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Special Fare Type"
                fullWidth
                sx={{ width: 200 }}
                value={formData.specialFareType || ""}
                onChange={(e) =>
                  handleChange("specialFareType", e.target.value)
                }
              >
                {specialFareTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Stops"
                fullWidth
                type="number"
                value={formData.stop}
                onChange={(e) => handleChange("stop", e.target.value)}
              />
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button variant="outlined" color="inherit" onClick={handleBack}>
              Back
            </Button>
            <Button
              variant="outlined"
              color="info"
              onClick={() => dispatch(getFlightByNumber(flightNumber))}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleGenerateSeats}
            >
              Generate Seats
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FlightEditPage;
