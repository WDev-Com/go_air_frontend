import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserByUsername,
  selectUserDetails,
  fetchUserBookings,
  selectUserBookings,
  selectLoading,
  selectError,
  cancelUserBooking,
  closeCancelModal,
} from "./userSlice";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Modal,
} from "@mui/material";
import { selectUser } from "../auth/authSlice";
import ConfirmModal from "../component/ConfirmModal";

const BookingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUserDetails);
  const bookings = useSelector(selectUserBookings) || [];
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  // const username = useSelector(selectUser);

  const cancelResponse = useSelector((state) => state.user.cancelResponse);
  const showCancelModal = useSelector((state) => state.user.showCancelModal);

  // ✅ local modal state for confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBookingNo, setSelectedBookingNo] = useState(null);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, []);

  // useEffect(() => {
  //   if (!user && username) {
  //     dispatch(fetchUserByUsername(username));
  //   }
  // }, [dispatch, user, username]);

  // useEffect(() => {
  //   if (user?.userID) {
  //     dispatch(fetchUserBookings());
  //   }
  // }, [dispatch, user?.userID]);

  const handleCancel = (bookingNo) => {
    setSelectedBookingNo(bookingNo);
    setConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    dispatch(cancelUserBooking(selectedBookingNo));
    setConfirmOpen(false);
    setSelectedBookingNo(null);
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
    setSelectedBookingNo(null);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography color="error" sx={{ textAlign: "center", mt: 3 }}>
          {error}
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography sx={{ textAlign: "center", mt: 3 }}>
          Fetching user details...
        </Typography>
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <Typography sx={{ textAlign: "center", mt: 3 }}>
          No bookings found.
        </Typography>
      </Box>
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
            position: "relative",
          }}
        >
          {/* ✅ Booking Status on Top-Right */}
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              top: 8,
              right: 12,
              fontWeight: "bold",
              color:
                b.status === "CANCELLED"
                  ? "error.main"
                  : b.status === "CONFIRMED"
                  ? "success.main"
                  : "text.secondary",
            }}
          >
            {b.status}
          </Typography>

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
            onClick={() => navigate(`/tickets/${b.id}`)}
          >
            View Tickets
          </Button>

          {/* ✅ Hide cancel button if already cancelled */}
          {b.status !== "CANCELLED" && (
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2, mx: 2 }}
              onClick={() => handleCancel(b.bookingNo)}
            >
              Cancel Booking
            </Button>
          )}
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

      {/* ✅ Universal Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        confirmText="Yes, Cancel"
        cancelText="No"
        confirmColor="error"
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseConfirm}
      />
    </Box>
  );
};

export default BookingsPage;
