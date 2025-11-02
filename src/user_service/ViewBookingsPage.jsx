import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserByUsername,
  selectUserDetails,
  fetchUserBookings,
  selectUserBookings,
  selectLoading,
  selectError,
} from "./userSlice";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import { selectUser } from "../auth/authSlice";

const BookingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUserDetails);
  const bookings = useSelector(selectUserBookings) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const username = useSelector(selectUser);
  useEffect(() => {
    // Step 1: Fetch user details first
    if (!user && username) {
      dispatch(fetchUserByUsername(username));
    }
  }, [dispatch, user, username]);

  useEffect(() => {
    // Step 2: Fetch bookings once user is loaded
    if (user?.userID) {
      dispatch(fetchUserBookings());
    }
  }, [dispatch, user?.userID]);

  //   console.log("User Bookings:", bookings);
  if (loading) {
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
        <Typography sx={{ ml: 2 }}>Loading bookings...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 3 }}>
        {error}
      </Typography>
    );
  }

  if (!user) {
    return (
      <Typography sx={{ textAlign: "center", mt: 3 }}>
        Fetching user details...
      </Typography>
    );
  }

  if (bookings.length === 0) {
    return (
      <Typography sx={{ textAlign: "center", mt: 3 }}>
        No bookings found.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        My Bookings
      </Typography>

      {bookings.map((b) => (
        <Box
          key={b.id}
          sx={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            p: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6">
            {b.airline} ({b.flightNumber})
          </Typography>
          <Typography>
            {b.sourceAirport} → {b.destinationAirport}
          </Typography>
          <Typography>
            Departure: {b.departureDate} {b.departureTime}
          </Typography>
          <Typography>Total Amount: ₹{b.totalAmount}</Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => {
              navigate(`/tickets/${b.id}`);
              //   console.log("Navigating to tickets for booking ID:", b.id);
            }}
          >
            View Tickets
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default BookingsPage;
