import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserByUsername,
  selectUserDetails,
  fetchUserBookings,
  selectUserBookings,
  selectLoading,
  selectError,
  cancelUserBooking,
  closeCancelModal, // ✅ added
} from "./userSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Modal, // ✅ added
} from "@mui/material";
import { selectUser } from "../auth/authSlice";

const BookingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUserDetails);
  const bookings = useSelector(selectUserBookings) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const username = useSelector(selectUser);

  // ✅ Modal selectors
  const cancelResponse = useSelector((state) => state.user.cancelResponse);
  const showCancelModal = useSelector((state) => state.user.showCancelModal);

  useEffect(() => {
    if (!user && username) {
      dispatch(fetchUserByUsername(username));
    }
  }, [dispatch, user, username]);

  useEffect(() => {
    if (user?.userID) {
      dispatch(fetchUserBookings());
    }
  }, [dispatch, user?.userID]);

  const handleCancel = (bookingNo) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      dispatch(cancelUserBooking(bookingNo));
    }
  };

  const handleCloseModal = () => {
    dispatch(closeCancelModal());
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    width: 500,
    maxHeight: "80vh",
    overflowY: "auto",
  };

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
          <Typography>Booking No : {b.bookingNo}</Typography>
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
            }}
          >
            View Tickets
          </Button>

          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2, mx: 2 }}
            onClick={() => handleCancel(b.bookingNo)}
          >
            Cancel Booking
          </Button>
        </Box>
      ))}

      {/* ✅ Cancel Response Modal */}
      <Modal open={showCancelModal} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Booking Cancellation Details
          </Typography>

          {cancelResponse && (
            <>
              <Typography sx={{ mb: 1 }}>
                <strong>Booking No:</strong> {cancelResponse.bookingNo}
              </Typography>
              <Typography sx={{ mb: 2 }}>{cancelResponse.message}</Typography>

              {Array.isArray(cancelResponse.flights) &&
                cancelResponse.flights.map((f, i) => (
                  <Box
                    key={i}
                    sx={{ borderTop: "1px solid #ddd", pt: 1, mt: 1 }}
                  >
                    <Typography variant="subtitle1">
                      Flight: {f.flightNumber}
                    </Typography>
                    <Typography>Status: {f.status}</Typography>
                    {f.refundAmount && (
                      <Typography>Refund Amount: ₹{f.refundAmount}</Typography>
                    )}
                    {f.cancellationCharges && (
                      <Typography>
                        Cancellation Charges: {f.cancellationCharges}
                      </Typography>
                    )}
                    <Typography sx={{ mt: 1 }}>{f.message}</Typography>
                  </Box>
                ))}
            </>
          )}

          <Button
            variant="contained"
            sx={{ mt: 3, display: "block", ml: "auto" }}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default BookingsPage;
