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
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
import FlightSummaryAccordion from "./components/FlightSummaryAccordion";
import ContactInformationCard from "./components/ContactInformationCard";

const FlightBookingPage = () => {
  const { flightNumber } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const filters = location.state?.filtersData || {};
  const selectedFlights = location.state?.selectedFlights || {};
  const tripType = filters.tripType || "ONE_WAY";

  const loggedUser = useSelector(selectUser);
  const user = useSelector(selectUserDetails);
  const flight = useSelector(selectFlightDetails);
  const loading = useSelector(selectLoading);
  const seats = useSelector(selectSeats);

  // === MULTI CITY STATE ===
  const routeKeys = Object.keys(selectedFlights);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const currentRouteKey =
    tripType !== "ONE_WAY" ? routeKeys[currentIndex] : null;
  // Only for maintaining reference of current flight in multi-city
  const currentFlight =
    tripType !== "ONE_WAY" ? selectedFlights[currentRouteKey] : flight;

  // === BOOKING OBJECT ===
  // Helper to generate alphanumeric booking number (PNR-style)
  const generateBookingNo = () => {
    const prefix = "GOA"; // or "GA"
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 random alphanumeric chars
    return `${prefix}${randomPart}`; // e.g., GOA7K9X3
  };

  const defaultPassenger = {
    firstName: "",
    lastName: "",
    gender: "",
    age: "",
    seatNo: "",
  };

  // Generate one common alphanumeric booking number for all flights
  const bookingNo = generateBookingNo();

  const [bookings, setBookings] = useState(
    (tripType === "ONE_WAY"
      ? [selectedFlights?.flightNumber ? selectedFlights : {}]
      : Object.values(selectedFlights)
    ).map((flight) => ({
      id: null,
      bookingNo: bookingNo, // same alphanumeric for all flights
      flightNumber: flight.flightNumber || "",
      aircraftSize: flight.aircraftSize || "",
      tripType: tripType || "ONE_WAY",

      departureTime: flight.departureTime || "",
      departureDate: flight.departureDate || "",
      arrivalTime: flight.arrivalTime || "",
      arrivalDate: flight.arrivalDate || "",

      contactEmail: "",
      contactPhone: "",

      bookingTime: new Date().toISOString(),
      passengerCount: filters.passengers ? parseInt(filters.passengers) : 1,
      totalAmount: flight.price
        ? flight.price * (filters.passengers ? parseInt(filters.passengers) : 1)
        : 0.0,

      status: "PENDING",
      specialFareType: filters.specialFareType || "NONE",
      journeyStatus: "NOT_STARTED",

      passengers: Array.from(
        { length: filters.passengers ? parseInt(filters.passengers) : 1 },
        () => ({ ...defaultPassenger })
      ),
    }))
  );

  // === FETCH USER, FLIGHT & SEATS ===
  useEffect(() => {
    if (loggedUser) dispatch(fetchUserByUsername(loggedUser));

    if (tripType === "ONE_WAY" && flightNumber) {
      dispatch(fetchSeatsByFlightNumber(flightNumber));
    } else if (tripType !== "ONE_WAY" && currentFlight?.flightNumber) {
      dispatch(fetchSeatsByFlightNumber(currentFlight.flightNumber));
    }
  }, [dispatch, loggedUser, flightNumber, currentFlight, tripType]);

  // === SYNC CONTACT INFO FROM USER ===
  useEffect(() => {
    if (user) {
      setBookings((prev) => ({
        ...prev,
        contactEmail: user.email || "",
        contactPhone: user.contact || "",
      }));
    }
  }, [user]);

  // === PASSENGER HANDLERS ===
  const handlePassengerChange = (index, field, value) => {
    setBookings((prev) => {
      const updated = [...prev.passengers];
      updated[index][field] = value;
      return { ...prev, passengers: updated };
    });
  };

  const addPassenger = () => {
    setBookings((prev) => ({
      ...prev,
      passengers: [...prev.passengers, { ...defaultPassenger }],
      passengerCount: prev.passengerCount + 1,
    }));
  };

  const removePassenger = (index) => {
    setBookings((prev) => {
      const updated = prev.passengers.filter((_, i) => i !== index);
      return { ...prev, passengers: updated, passengerCount: updated.length };
    });
  };

  // === SEAT SELECTION ===
  const handleSeatSelect = (seatNumber) => {
    if (!seatNumber) return;

    setBookings((prevBooking) => {
      // Copy current passengers
      const updatedPassengers = [...prevBooking.passengers];

      // Check if the seat is already selected by any passenger
      const alreadySelected = updatedPassengers.some(
        (p) => p.seatNo === seatNumber
      );

      if (alreadySelected) {
        // Deselect the seat (remove from whoever has it)
        updatedPassengers.forEach((p) => {
          if (p.seatNo === seatNumber) p.seatNo = "";
        });
      } else {
        // Assign seat to the next passenger without one
        const nextUnassigned = updatedPassengers.find((p) => !p.seatNo);
        if (nextUnassigned) nextUnassigned.seatNo = seatNumber;
      }

      // Return updated booking object
      return {
        ...prevBooking,
        passengers: updatedPassengers,
      };
    });
  };

  // === FORM VALIDATION ===
  const isFormComplete = bookings.passengers.every(
    (p) =>
      p.name.trim() &&
      p.age &&
      p.gender !== "SELECT GENDER" &&
      p.passportNumber.trim() &&
      p.seatNo
  );

  const filledInfoCount = bookings.passengers.filter(
    (p) =>
      p.name.trim() &&
      p.age &&
      p.gender !== "SELECT GENDER" &&
      p.passportNumber.trim()
  ).length;

  // === NAVIGATION BETWEEN FLIGHTS (no reload) ===
  const handleNextFlight = () => {
    if (currentIndex < routeKeys.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };
  const handlePreviousFlight = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // === BOOKING SUBMISSION ===
  const handleBooking = async () => {
    const payload = {
      ...bookings,
      flights:
        tripType === "ONE_WAY"
          ? [flight]
          : routeKeys.map((key) => selectedFlights[key]),
    };

    try {
      const result = await dispatch(
        bookFlight({ userID: user?.userID, bookingData: payload })
      ).unwrap();
      navigate("/booking-completed", { state: result });
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  if (loading || (!flight && tripType === "ONE_WAY"))
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6">Loading flight details...</Typography>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Complete Your Booking
      </Typography>

      {/* Flight Summary Dropdown */}
      <FlightSummaryAccordion
        expanded={expanded}
        handleChange={handleChange}
        selectedFlights={selectedFlights}
      />

      {/* === CONTACT INFO === */}
      <ContactInformationCard booking={bookings} setBooking={setBookings} />

      {/* === PASSENGER FORM === */}
      <PassengerForm
        passengers={bookings.passengers}
        onPassengerChange={handlePassengerChange}
        onAddPassenger={addPassenger}
        onRemovePassenger={removePassenger}
        filledInfoCount={filledInfoCount}
      />

      {/* === SEAT MAP === */}
      <CardContent
        sx={{
          height: 500,
          p: 0,
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "white",
            backgroundColor: "#1976d2",
            fontWeight: 600,
            p: 1.2,
          }}
        >
          Select Seats For{" "}
          {tripType !== "ONE_WAY"
            ? currentRouteKey.replace(/_/g, " to ")
            : `${flight?.sourceAirport} → ${flight?.destinationAirport}`}
        </Typography>

        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <SeatMap
            seats={seats}
            aircraftSize={currentFlight?.aircraftSize}
            selectedSeats={bookings.passengers
              .map((p) => p.seatNo)
              .filter(Boolean)}
            onSeatSelect={handleSeatSelect}
          />
        </Box>

        {tripType !== "ONE_WAY" && (
          <>
            <IconButton
              onClick={handlePreviousFlight}
              disabled={currentIndex === 0}
              sx={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: "translateY(-50%)",
                bgcolor: "#fff",
                boxShadow: 3,
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            <IconButton
              onClick={handleNextFlight}
              disabled={currentIndex === routeKeys.length - 1}
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                bgcolor: "#fff",
                boxShadow: 3,
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}
      </CardContent>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          sx={{ py: 1.5, fontWeight: "bold", borderRadius: 2 }}
          onClick={() => {
            // handleBooking()
            console.log("Booking data:", bookings);
          }}
          disabled={!isFormComplete || loading}
        >
          {loading
            ? "Booking..."
            : tripType === "ONE_WAY"
            ? "Confirm Booking"
            : "Confirm All Flights"}
        </Button>

        {!isFormComplete && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            ⚠️ Please complete all passenger details and seat selection before
            confirming booking.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FlightBookingPage;
