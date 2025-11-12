import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  CardContent,
  Button,
  Card,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings, selectBookings, selectLoading } from "./adminSlice";
import BookingFilters from "./component/BookingFilters";

const AllBookingsPage = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookings);
  const loading = useSelector(selectLoading);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filters, setFilters] = useState({
    bookingNo: "",
    flightNumber: "",
    tripType: "",
    user: "",
    status: "",
    specialFareType: "",
    journeyStatus: "",
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    dispatch(fetchBookings(filters));
    // console.log("Applied Filters:", filters);
  };

  const handleReset = () => {
    setFilters({
      bookingNo: "",
      flightNumber: "",
      tripType: "",
      user: "",
      status: "",
      specialFareType: "",
      journeyStatus: "",
    });
    dispatch(fetchBookings());
  };

  useEffect(() => {
    dispatch(fetchBookings()); // Fetch all bookings without filters initially
  }, []);

  useEffect(() => {}, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // console.log(loading);
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  // console.log(bookings);
  return (
    <>
      <Box sx={{ p: 3 }}>
        <BookingFilters
          filters={filters}
          handleFilterChange={handleFilterChange}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="contained" onClick={handleSearch}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        </Box>

        {/* Bookings list / table can go below */}
      </Box>
      <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <Card sx={{ maxWidth: "100%", boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              ✈️ Flight Bookings
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: "#1976d2" }}>
                  <TableRow>
                    <TableCell>Booking No</TableCell>
                    <TableCell>User ID</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Flight No</TableCell>
                    <TableCell>Trip Type</TableCell>
                    <TableCell>Departure Date</TableCell>
                    <TableCell>Departure Time</TableCell>
                    <TableCell>Arrival Date</TableCell>
                    <TableCell>Arrival Time</TableCell>
                    <TableCell>Contact Email</TableCell>
                    <TableCell>Passenger Count</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Fare Type</TableCell>
                    <TableCell>Journey Status</TableCell>
                    <TableCell>Booking Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((b) => (
                      <TableRow key={b.id}>
                        <TableCell>{b.bookingNo}</TableCell>
                        <TableCell>{b.userID}</TableCell>
                        <TableCell>{b.username}</TableCell>
                        <TableCell>{b.flightNumber}</TableCell>
                        <TableCell>{b.tripType.replace("_", " ")}</TableCell>
                        <TableCell>{b.departureDate}</TableCell>
                        <TableCell>{b.departureTime}</TableCell>
                        <TableCell>{b.arrivalDate}</TableCell>
                        <TableCell>{b.arrivalTime}</TableCell>
                        <TableCell>{b.contactEmail}</TableCell>
                        <TableCell>{b.passengerCount}</TableCell>
                        <TableCell>{b.totalAmount}</TableCell>
                        <TableCell>{b.status}</TableCell>
                        <TableCell>{b.specialFareType}</TableCell>
                        <TableCell>{b.journeyStatus}</TableCell>
                        <TableCell>
                          {" "}
                          {new Date(b.bookingTime).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <TablePagination
          component="div"
          count={bookings.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </>
  );
};

export default AllBookingsPage;
