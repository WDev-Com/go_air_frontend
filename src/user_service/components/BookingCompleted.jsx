import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const BookingCompleted = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, textAlign: "center" }}>
      <Card sx={{ p: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            {data.message || "Flight booked successfully!"}
          </Typography>

          <Typography>User ID: {data.userId}</Typography>
          <Typography>Booking ID: {data.bookingId}</Typography>
          <Typography>Status: {data.status}</Typography>
          <Typography>Booking Time: {data.bookingTime}</Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookingCompleted;
