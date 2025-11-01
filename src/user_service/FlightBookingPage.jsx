import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserByUsername,
  fetchFlightByNumber,
  bookFlight,
  selectUserDetails,
  selectFlightDetails,
  selectLoading,
  fetchSeatsByFlightNumber,
  selectSeats,
} from "./userSlice";
import { selectUser } from "../auth/authSlice";
import SeatMap from "./components/SeatMap";
import PassengerForm from "./components/PassengerForm";

const defaultPassenger = {
  name: "",
  age: "",
  gender: "SELECT GENDER",
  passportNumber: "",
  seatNo: "",
};

const FlightBookingPage = () => {
  const { flightNumber } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const filters = location.state?.filtersData || {};

  const loggedUser = useSelector(selectUser);
  const user = useSelector(selectUserDetails);
  const flight = useSelector(selectFlightDetails);
  const loading = useSelector(selectLoading);
  const seats = useSelector(selectSeats);

  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [specialFareType, setSpecialFareType] = useState(
    filters.specialFareType || "NONE"
  );

  // Initialize passengers
  const initialPassengerCount = filters.passengers
    ? Math.max(1, parseInt(filters.passengers))
    : 1;

  const [passengers, setPassengers] = useState(
    Array.from({ length: initialPassengerCount }, () => ({
      ...defaultPassenger,
    }))
  );

  // Fetch data
  useEffect(() => {
    if (loggedUser) dispatch(fetchUserByUsername(loggedUser));
    if (flightNumber) {
      dispatch(fetchFlightByNumber(flightNumber));
      dispatch(fetchSeatsByFlightNumber(flightNumber));
    }
  }, [loggedUser, flightNumber, dispatch]);

  // Sync contact info
  useEffect(() => {
    if (user) {
      setContactEmail(user.email || "");
      setContactPhone(user.contact || "");
    }
  }, [user]);

  // Add passenger
  const addPassenger = () => {
    setPassengers((prev) => [...prev, { ...defaultPassenger }]);
  };

  // Remove passenger
  const removePassenger = (index) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle passenger input changes
  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) => {
      const updated = prev.map((p) => ({ ...p }));
      updated[index][field] = value;
      return updated;
    });
  };

  // ✅ Auto seat assign / reassign logic
  const handleSeatSelect = (rawSeatNumber) => {
    const seatNumber = rawSeatNumber == null ? "" : String(rawSeatNumber);

    setPassengers((prev) => {
      const updated = prev.map((p) => ({ ...p }));
      const passengerCount = updated.length;

      let currentSelectedSeats = updated
        .map((p) => p.seatNo)
        .filter((s) => s && s !== "");

      // if seat already selected, deselect it
      if (currentSelectedSeats.includes(seatNumber)) {
        currentSelectedSeats = currentSelectedSeats.filter(
          (s) => s !== seatNumber
        );
      } else {
        // replace oldest seat if full
        if (currentSelectedSeats.length < passengerCount) {
          currentSelectedSeats.push(seatNumber);
        } else {
          currentSelectedSeats.shift();
          currentSelectedSeats.push(seatNumber);
        }
      }

      updated.forEach((p, i) => {
        p.seatNo = currentSelectedSeats[i] || "";
      });

      return updated;
    });
  };

  // ✅ Check if all passenger info is filled
  const isFormComplete = passengers.every(
    (p) =>
      p.name.trim() &&
      p.age &&
      p.gender &&
      p.gender !== "SELECT GENDER" &&
      p.passportNumber.trim() &&
      p.seatNo
  );

  // ✅ Count filled info (for progress display)
  const filledInfoCount = passengers.filter(
    (p) =>
      p.name.trim() &&
      p.age &&
      p.gender !== "SELECT GENDER" &&
      p.passportNumber.trim()
  ).length;

  // ✅ Handle booking
  const handleBooking = async () => {
    if (!user || !flight) return;

    const bookingData = {
      flightNumber,
      tripType: "ONE_WAY",
      contactEmail,
      contactPhone,
      specialFareType,
      passengers,
    };

    try {
      const result = await dispatch(
        bookFlight({ userID: user?.userID, bookingData })
      ).unwrap();
      navigate("/booking-completed", { state: result });
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  if (loading || !flight)
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">Loading flight details...</Typography>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      {/* Flight Info */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {flight.airline} ({flight.flightNumber})
          </Typography>
          <Typography color="text.secondary">
            {flight.sourceAirport} → {flight.destinationAirport}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            {flight.departureTime} - {flight.arrivalTime} |{" "}
            <strong>₹{flight.price?.toLocaleString()}</strong>
          </Typography>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6">Contact Information</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                label="Email"
                fullWidth
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone"
                fullWidth
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Special Fare Type"
                value={specialFareType}
                onChange={(e) => setSpecialFareType(e.target.value)}
              >
                <MenuItem value="NONE">None</MenuItem>
                <MenuItem value="ARMED_FORCES">Armed Forces</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
                <MenuItem value="SENIOR_CITIZEN">Senior Citizen</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Passenger Form */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <PassengerForm
            passengers={passengers}
            onPassengerChange={handlePassengerChange}
            onAddPassenger={addPassenger}
            onRemovePassenger={removePassenger}
            filledInfoCount={filledInfoCount}
          />
        </CardContent>
      </Card>

      {/* Seat Map */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
        <Box
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            py: 1,
            textAlign: "center",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          <Typography variant="h6">Select Your Seat</Typography>
        </Box>

        <CardContent sx={{ overflow: "auto", height: 500, p: 0 }}>
          <SeatMap
            seats={seats}
            aircraftSize={flight.aircraftSize}
            selectedSeats={passengers
              .map((p) => (p.seatNo ? String(p.seatNo) : ""))
              .filter(Boolean)}
            onSeatSelect={handleSeatSelect}
          />
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      {/* Confirm Booking Button */}
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2 }}
          onClick={handleBooking}
          disabled={!isFormComplete || loading}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </Button>

        {/* Red warning message */}
        {!isFormComplete && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 1, fontWeight: 500 }}
          >
            ⚠️ Please complete all passenger details and seat selection before
            confirming booking.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FlightBookingPage;
