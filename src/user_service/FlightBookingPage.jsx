import React, { useEffect, useState } from "react";
import {
  Box,
  CardContent,
  Typography,
  Button,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserByUsername,
  bookFlight,
  selectUserDetails,
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingLoading, setBookingLoading] = useState(false);

  const filters = location.state?.filtersData || {};
  const selectedFlights = location.state?.selectedFlights || {};
  const tripType = filters.tripType;
  const loggedUser = useSelector(selectUser);
  const user = useSelector(selectUserDetails);
  const loading = useSelector(selectLoading);

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
  const currentFlight = selectedFlights[currentRouteKey];

  // === BOOKING OBJECT ===
  // Helper to generate alphanumeric booking number (PNR-style)
  const generateBookingNo = () => {
    const prefix = "GOA"; // or "GA"
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 random alphanumeric chars
    return `${prefix}${randomPart}`; // e.g., GOA7K9X3
  };

  const defaultPassenger = {
    name: "",
    gender: "",
    age: "",
    seatNo: "",
  };

  const [commonPassengers, setCommonPassengers] = useState(
    Array.from(
      { length: filters.passengers ? parseInt(filters.passengers) : 1 },
      () => ({
        name: "",
        gender: "",
        age: "",
        passportNumber: "",
      })
    )
  );

  // New state to store seat maps by flight number
  const [seatMaps, setSeatMaps] = useState({}); // { [flightNo]: seatsArray }

  // Generate one common alphanumeric booking number for all flights
  const bookingNo = generateBookingNo();

  const [bookings, setBookings] = useState(
    (tripType === "ONE_WAY"
      ? [selectedFlights[routeKeys[0]]]
      : Object.values(selectedFlights)
    ).map((flight) => ({
      bookingNo: bookingNo, // same alphanumeric for all flights
      flightNumber: flight.flightNumber || "",
      aircraftSize: flight.aircraftSize || "",
      tripType: tripType || "ONE_WAY",

      departureTime: flight.departureTime || "",
      departureDate: flight.departureDate || "",
      arrivalTime: flight.arrivalTime || "",
      arrivalDate: flight.arrivalDate || "",

      contactEmail: user ? user.email : "",
      contactPhone: user ? user.contact : "",

      bookingTime: new Date().toISOString(),
      passengerCount: filters.passengers ? parseInt(filters.passengers) : 1,
      totalAmount: flight.price
        ? flight.price * (filters.passengers ? parseInt(filters.passengers) : 1)
        : 0.0,

      status: "PENDING",
      specialFareType: filters.specialFareType || "NONE",
      journeyStatus: "SCHEDULED",

      passengers: commonPassengers.map((p) => ({ ...p, seatNo: "" })),
    }))
  );

  // === FETCH USER, FLIGHT & SEATS ===
  useEffect(() => {
    if (loggedUser) {
      dispatch(fetchUserByUsername(loggedUser));
    }
  }, [dispatch, loggedUser]);

  // Fetch seats for ALL selected flights on mount
  useEffect(() => {
    const fetchAllSeatMaps = async () => {
      // For multi-segment trips
      const flightsToFetch =
        tripType === "ONE_WAY"
          ? [selectedFlights[routeKeys[0]]]
          : Object.values(selectedFlights);

      const seatMapObj = {};
      for (const flight of flightsToFetch) {
        // Dispatch fetch for each flight
        const action = await dispatch(
          fetchSeatsByFlightNumber(flight.flightNumber)
        );
        // Assuming action.payload has the seat map
        seatMapObj[flight.flightNumber] = action.payload;
      }
      setSeatMaps(seatMapObj);
    };

    if (Object.keys(selectedFlights).length > 0) {
      fetchAllSeatMaps();
    }
  }, [dispatch, selectedFlights, tripType]);

  // Instead of useSelector(selectSeats), we now use seatMaps[flightNumber]
  const displayedSeatMap =
    tripType === "ONE_WAY"
      ? seatMaps[selectedFlights[routeKeys[0]]?.flightNumber]
      : seatMaps[selectedFlights[routeKeys[currentIndex]]?.flightNumber];

  // === SYNC CONTACT INFO FROM USER ===
  useEffect(() => {
    if (user && bookings.length > 0) {
      setBookings((prevBookings) =>
        prevBookings.map((booking) => ({
          ...booking,
          contactEmail: user.email || "",
          contactPhone: user.contact || "",
        }))
      );
    }
  }, [user]);

  useEffect(() => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) => ({
        ...booking,
        passengers: booking.passengers.map((p, i) => ({
          ...p,
          name: commonPassengers[i]?.name || "",
          age: commonPassengers[i]?.age || "",
          gender: commonPassengers[i]?.gender || "",
          passportNumber: commonPassengers[i]?.passportNumber || "",
        })),
      }))
    );
  }, [commonPassengers]);
  // console.log(
  //   "selected Flight : ",
  //   selectedFlights[routeKeys[currentIndex]].flightNumber
  // );
  // console.log("From FBP page ", bookings);

  // === PASSENGER HANDLERS ===
  const handlePassengerChange = (index, field, value) => {
    setCommonPassengers((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // Add a new passenger
  const addPassenger = () => {
    // 1️⃣ Update commonPassengers
    setCommonPassengers((prev) => [
      ...prev,
      { name: "", age: "", gender: "", passportNumber: "" },
    ]);

    // 2️⃣ Update bookings (just add a new passenger slot for each flight)
    setBookings((prevBookings) =>
      prevBookings.map((booking) => ({
        ...booking,
        passengers: [
          ...booking.passengers,
          { ...defaultPassenger }, // only seat info etc. per flight
        ],
        passengerCount: booking.passengers.length + 1,
      }))
    );
  };

  // Remove a passenger at index
  const removePassenger = (index) => {
    setCommonPassengers((prev) => prev.filter((_, i) => i !== index));

    setBookings((prevBookings) =>
      prevBookings.map((booking) => ({
        ...booking,
        passengers: booking.passengers.filter((_, i) => i !== index),
        passengerCount: booking.passengers.length - 1,
      }))
    );
  };

  // === SEAT SELECTION (cyclic, fully reselectable for all passengers) ===
  const handleSeatSelect = (rawSeatNumber) => {
    const seatNumber = rawSeatNumber == null ? "" : String(rawSeatNumber);
    setExpanded(false); // collapse flight summary on seat select
    setBookings((prevBookings) => {
      const updatedBookings = prevBookings.map((b) => ({
        ...b,
        passengers: Array.isArray(b.passengers)
          ? b.passengers.map((p) => ({ ...p }))
          : [],
      }));

      const targetIndex = tripType === "ONE_WAY" ? 0 : currentIndex;
      const booking = updatedBookings[targetIndex];
      const passengers = booking.passengers;
      const passengerCount = passengers.length;

      // get currently assigned seats
      let currentSelectedSeats = passengers
        .map((p) => p.seatNo)
        .filter(Boolean);

      const seatIndex = currentSelectedSeats.indexOf(seatNumber);

      if (seatIndex !== -1) {
        // deselect
        currentSelectedSeats.splice(seatIndex, 1);
      } else {
        if (currentSelectedSeats.length < passengerCount) {
          currentSelectedSeats.push(seatNumber);
        } else {
          currentSelectedSeats.shift();
          currentSelectedSeats.push(seatNumber);
        }
      }

      passengers.forEach((p, i) => {
        p.seatNo = currentSelectedSeats[i] || "";
      });

      booking.passengers = passengers;
      updatedBookings[targetIndex] = booking;

      return updatedBookings;
    });
  };

  // === FORM COMPLETION CHECK ===

  const currentBooking =
    Array.isArray(bookings) && bookings.length > 0
      ? tripType === "ONE_WAY"
        ? bookings[0]
        : bookings[currentIndex] || { passengers: [] }
      : { passengers: [] };

  // === Ensure passengers array exists ===
  const passengers = Array.isArray(currentBooking.passengers)
    ? currentBooking.passengers
    : [];
  // console.log("Current Booking:", currentBooking);
  // === FORM VALIDATION ===
  const isFormComplete = bookings.every(
    (booking) =>
      Array.isArray(booking.passengers) &&
      booking.passengers.length > 0 &&
      booking.passengers.every(
        (p) => !!p.name?.trim() && !!p.age && !!p.gender && !!p.seatNo
      )
  );

  // === FILLED INFO COUNT ===
  const filledInfoCount = passengers.filter(
    (p) => !!p.name?.trim() && !!p.age && !!p.gender
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
    try {
      if (!user?.userID) throw new Error("User not logged in");

      if (!bookings || bookings.length === 0)
        throw new Error("No flights selected for booking");
      // console.log("Bookings to submit:", bookings);
      // Ensure every booking has passengers with assigned seats
      bookings.forEach((b, idx) => {
        if (!b.passengers || b.passengers.length === 0) {
          throw new Error(`No passengers added for booking ${idx + 1}`);
        }
        b.passengers.forEach((p, pIdx) => {
          if (!p.seatNo) {
            throw new Error(
              `Seat not selected for passenger ${p.name} on flight ${b.flightNumber}`
            );
          }
        });
      });
      setBookingLoading(true);
      // Prepare payload for backend
      const bookingPayload =
        tripType === "ONE_WAY"
          ? [bookings[0]] // single flight
          : bookings.map((b) => ({
              ...b,
              tripType, // include the overall trip type
            }));

      // Call Redux asyncThunk
      const result = await dispatch(
        bookFlight({ userID: user.userID, bookingData: bookingPayload })
      ).unwrap();

      // console.log("Booking successful:", result);

      navigate("/booking-completed", { state: result });
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.message || "Booking failed. Please check your inputs.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (bookingLoading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          gap: 2,
          p: 3,
        }}
      >
        <CircularProgress size={60} thickness={5} />
        <Typography variant="h6" sx={{ mt: 1 }}>
          Processing your booking...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we confirm your seats and generate your booking.
        </Typography>
      </Box>
    );

  // console.log(flight);
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh", // centers vertically
          gap: 2, // space between spinner and text
          p: 3, // padding around content
        }}
      >
        <CircularProgress size={60} thickness={5} />
        <Typography variant="h6" sx={{ mt: 1 }}>
          Loading flight details...
        </Typography>
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
      <ContactInformationCard
        booking={bookings[currentIndex]}
        setBooking={setBookings}
        currentIndex={currentIndex}
        tripType={tripType}
      />

      {/* === PASSENGER FORM === */}
      {(
        tripType === "ONE_WAY"
          ? bookings[0]?.passengers
          : bookings[currentIndex]?.passengers
      ) ? (
        <PassengerForm
          passengers={
            tripType === "ONE_WAY"
              ? bookings[0].passengers
              : bookings[currentIndex].passengers
          }
          onPassengerChange={handlePassengerChange}
          onAddPassenger={addPassenger}
          onRemovePassenger={removePassenger}
          filledInfoCount={filledInfoCount}
        />
      ) : (
        <Typography sx={{ my: 2, color: "gray", textAlign: "center" }}>
          Loading passenger details...
        </Typography>
      )}

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
            : `${selectedFlights[currentIndex]?.sourceAirport} → ${selectedFlights[currentIndex]?.destinationAirport}`}
        </Typography>

        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <SeatMap
            // seats={seats}
            seats={displayedSeatMap}
            aircraftSize={currentFlight?.aircraftSize}
            selectedSeats={(bookings[currentIndex]?.passengers || [])
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
            handleBooking();
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
