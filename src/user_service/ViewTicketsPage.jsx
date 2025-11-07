import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserTickets,
  selectUserTickets,
  selectLoading,
  selectError,
} from "./userSlice";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Chip,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
const ViewTicketsPage = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const tickets = useSelector(selectUserTickets);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  useEffect(() => {
    dispatch(fetchUserTickets(bookingId));
  }, [dispatch, bookingId]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading tickets...</Typography>
      </Box>
    );

  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 3 }}>
        {error}
      </Typography>
    );

  if (!tickets || tickets.length === 0)
    return (
      <Typography sx={{ textAlign: "center", mt: 3 }}>
        No tickets found.
      </Typography>
    );
  // console.log(tickets[0]);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        ✈️ My Flight Tickets
      </Typography>

      {tickets.map((t, index) => (
        <Card
          key={index}
          sx={{
            mb: 3,
            borderRadius: "16px",
            boxShadow: 4,
            overflow: "hidden",
            background: "linear-gradient(135deg, #f3f9ff, #ffffff)",
          }}
        >
          <CardContent>
            {/* Flight Header */}
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "#1976d2" }}
                >
                  {t.airline} ({t.flightNumber})
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  {t.aircraftSize} • {t.travelClass} • {t.bookingType}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} textAlign={{ xs: "left", md: "right" }}>
                <Chip
                  label={t.bookingStatus}
                  color={
                    t.bookingStatus === "CONFIRMED"
                      ? "success"
                      : t.bookingStatus === "CANCELLED"
                      ? "error"
                      : "warning"
                  }
                  sx={{ fontWeight: "bold" }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Route Info */}
            <Grid container alignItems="center" justifyContent="space-between">
              {/* ===== Source ===== */}
              <Grid item xs={5}>
                <Box display="flex" alignItems="center" gap={1}>
                  <FlightTakeoffIcon sx={{ color: "#1976d2", fontSize: 30 }} />
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {t.sourceAirport}
                  </Typography>
                </Box>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {t.departureDate} {t.departureTime}
                </Typography>
              </Grid>

              {/* ===== Arrow Between ===== */}
              <Grid
                item
                xs={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {/* Line */}
                <Box
                  sx={{
                    width: "100%",
                    height: "2px",
                    backgroundColor: "#1976d2",
                    position: "absolute",
                    top: "50%",
                    zIndex: 0,
                  }}
                />
                {/* Arrow */}
                <ArrowForwardIcon
                  sx={{
                    color: "#1976d2",
                    fontSize: 36,
                    backgroundColor: "#f9fbff",
                    zIndex: 1,
                  }}
                />
              </Grid>

              {/* ===== Destination ===== */}
              <Grid item xs={5} textAlign="right">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  gap={1}
                >
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {t.destinationAirport}
                  </Typography>
                  <FlightLandIcon sx={{ color: "#1976d2", fontSize: 30 }} />
                </Box>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {t.arrivalDate} {t.arrivalTime}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Passenger Info */}
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: "bold", color: "#444", mb: 1 }}
            >
              Passenger Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography>Name: {t.passengerName}</Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography>Gender: {t.gender}</Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography>Age: {t.age}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography>Passport: {t.passportNumber}</Typography>
              </Grid>
              <Grid item xs={6} md={2}>
                <Typography>
                  Seat: {t.seatNo} ({t.seatType})
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Fare and Booking Info */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography>Trip Type: {t.tripType}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Fare Type: {t.specialFareType}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Duration: {t.durationMinutes} mins</Typography>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={4}>
                <Typography>Passengers: {t.passengerCount}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Journey Status: {t.journeyStatus}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography>Stops: {t.stop}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Price and Booking Time */}
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Booking Time: {new Date(t.bookingTime).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ₹ {t.totalAmount.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ViewTicketsPage;
