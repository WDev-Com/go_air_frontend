import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Paper,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlightIcon from "@mui/icons-material/Flight";
import PersonIcon from "@mui/icons-material/Person";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const userId = searchParams.get("userId");
  const bookingNo = searchParams.get("bookingNo");

  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) throw new Error("Missing session ID in URL.");

        const token = localStorage.getItem("jwtToken");

        await new Promise((res) => setTimeout(res, 2000));

        const res = await fetch(
          `http://localhost:8080/api/payment/verify-payment?session_id=${sessionId}&userId=${userId}&bookingNo=${bookingNo}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        const data = await res.json();
        setPaymentDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: "80vh",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box
        sx={{
          textAlign: "center",
          mt: 10,
        }}
      >
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go Back to Home
        </Button>
      </Box>
    );

  const response = paymentDetails.response;
  // console.log(response);
  return (
    <Box sx={{ p: 4 }}>
      <Paper
        elevation={4}
        sx={{ p: 4, borderRadius: 3, maxWidth: 900, mx: "auto" }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <CheckCircleIcon sx={{ color: "green", fontSize: 70 }} />
          <Typography variant="h4" sx={{ mt: 1 }}>
            Payment Successful 🎉
          </Typography>
        </Box>

        {/* Payment Summary */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Payment Summary</Typography>
            <Divider sx={{ my: 1 }} />

            <Typography>
              <strong>Status:</strong>{" "}
              <Chip
                label={response.payment_status}
                color="success"
                size="small"
              />
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Amount:</strong> ₹{response.amount / 100}
            </Typography>

            <Typography>
              <strong>Payment ID:</strong> {response.payment_id}
            </Typography>

            <Typography>
              <strong>Currency:</strong> {response.currency.toUpperCase()}
            </Typography>

            <Typography>
              <strong>Customer Email:</strong> {response.customer_email}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Booking Time:</strong> {response.bookingTime}
            </Typography>
          </CardContent>
        </Card>

        {/* Booking Summary */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">Booking Summary</Typography>
            <Divider sx={{ my: 1 }} />

            <Typography>
              <strong>User ID:</strong> {response.userId}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Booking Number:</strong>{" "}
              <Chip label={response.bookingNumber} color="primary" />
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Message:</strong> {response.message}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Booking Status:</strong>{" "}
              <Chip label={response.booking_status} color="success" />
            </Typography>
          </CardContent>
        </Card>

        {/* List of Bookings */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Flight Details
        </Typography>

        {response.bookingDetails?.map((booking, index) => (
          <Card key={index} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1}>
                <FlightIcon color="primary" />
                <Typography variant="h6">
                  Flight: {booking.flightNumber}
                </Typography>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Typography>
                <strong>Airline:</strong> {booking.airline}
              </Typography>
              <Typography>
                <strong>Route:</strong> {booking.sourceAirport} →{" "}
                {booking.destinationAirport}
              </Typography>
              <Typography>
                <strong>Departure:</strong> {booking.departureDate} at{" "}
                {booking.departureTime}
              </Typography>
              <Typography>
                <strong>Arrival:</strong> {booking.arrivalDate} at{" "}
                {booking.arrivalTime}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Total Amount:</strong> ₹{booking.totalAmount}
              </Typography>

              {/* PASSENGERS */}
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                Passengers:
              </Typography>
              <Divider sx={{ mb: 1 }} />

              {booking.passengers?.map((p, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: "#f7f7f7",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonIcon fontSize="small" />
                    <Typography>
                      <strong>{p.name}</strong> ({p.gender}, {p.age} yrs)
                    </Typography>
                  </Stack>

                  <Typography>
                    <strong>Seat:</strong> {p.seatNo} ({p.travelClass})
                  </Typography>
                  <Typography>
                    <strong>Passport:</strong> {p.passportNumber || "N/A"}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}

        <Button
          variant="contained"
          sx={{ mt: 3, borderRadius: 2 }}
          onClick={() => navigate("/")}
        >
          Go Back
        </Button>
      </Paper>
    </Box>
  );
}
