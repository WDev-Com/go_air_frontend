import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Snackbar,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchFlights,
  selectFlights,
  selectLoading,
  selectError,
  selectTotalElements,
  deleteFlight,
} from "./adminSlice";
import FilterPanel from "./FilterPanel";

const AdminFlightsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const flights = useSelector(selectFlights);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const totalElements = useSelector(selectTotalElements);

  const [filters, setFilters] = useState({
    airlines: [],
    sourceAirport: "",
    destinationAirport: "",
    departureDate: "",
    stop: 0,
    bookingType: "",
    departureType: "",
    minPrice: 0,
    maxPrice: 30000,
    aircraftSize: "",
    specialFareType: "",
    page: 0,
    limit: 5,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle changes in filter inputs
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Apply filters
  const handleSubmit = () => {
    setFilters((prev) => ({ ...prev, page: 0 }));
    dispatch(fetchFlights({ ...filters, page: 0 }));
  };

  // Clear filters
  const handleClear = () => {
    const resetFilters = {
      airlines: [],
      sourceAirport: "",
      destinationAirport: "",
      departureDate: "",
      stop: 0,
      bookingType: "",
      departureType: "",
      minPrice: 0,
      maxPrice: 30000,
      aircraftSize: "",
      specialFareType: "",
      page: 0,
      limit: 5,
    };
    setFilters(resetFilters);
    dispatch(fetchFlights(resetFilters));
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    dispatch(fetchFlights({ ...filters, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    const newLimit = +event.target.value;
    setFilters((prev) => ({ ...prev, limit: newLimit, page: 0 }));
    dispatch(fetchFlights({ ...filters, limit: newLimit, page: 0 }));
  };

  // Fetch flights initially and when filters change
  useEffect(() => {
    dispatch(fetchFlights(filters));
  }, [dispatch, filters]);

  // Navigate to edit page
  const handleEditFlight = (id) => {
    navigate(`/admin/edit-flight/${id}`);
  };

  const handleDeleteFlight = async (flightNumber) => {
    if (
      window.confirm(`Are you sure you want to delete flight ${flightNumber}?`)
    ) {
      try {
        await dispatch(deleteFlight(flightNumber));
        dispatch(fetchFlights(filters)); // Refresh list
        setSnackbar({
          open: true,
          message: `Flight ${flightNumber} deleted successfully.`,
          severity: "success",
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Failed to delete flight ${flightNumber}.`,
          severity: "error",
        });
      }
    }
  };

  // console.log(loading);

  return (
    <>
      <Box sx={{ p: 4, mb: -3.5, backgroundColor: "#f9fafb" }}>
        <FilterPanel
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleClear={handleClear}
          filters={filters}
        />
      </Box>

      <Box sx={{ p: 4, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
        <Card sx={{ maxWidth: "100%", boxShadow: 3, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              ✈️ Flight Management
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {loading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                py={5}
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error" textAlign="center">
                {error}
              </Typography>
            ) : (
              <>
                <TableContainer
                  component={Paper}
                  sx={{ borderRadius: 2, boxShadow: 2 }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#1976d2" }}>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Flight No
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Airline
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Route
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Departure
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Arrival
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Duration
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Price (₹)
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Seats
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Status
                        </TableCell>
                        <TableCell sx={{ color: "white", fontWeight: 600 }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {flights.map((flight) => (
                        <TableRow key={flight.id} hover>
                          <TableCell>{flight.flightNumber}</TableCell>
                          <TableCell>{flight.airline}</TableCell>
                          <TableCell>
                            {flight.sourceAirport} → {flight.destinationAirport}
                          </TableCell>
                          <TableCell>
                            {flight.departureDate} <br />
                            <Typography variant="body2" color="text.secondary">
                              {flight.departureTime}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {flight.arrivalDate} <br />
                            <Typography variant="body2" color="text.secondary">
                              {flight.arrivalTime}
                            </Typography>
                          </TableCell>
                          <TableCell>{flight.durationMinutes} min</TableCell>
                          <TableCell>{flight.price}</TableCell>
                          <TableCell>{flight.availableSeats}</TableCell>
                          <TableCell>
                            <Chip
                              label={flight.journeyStatus}
                              color={
                                flight.journeyStatus === "SCHEDULED"
                                  ? "primary"
                                  : flight.journeyStatus === "COMPLETED"
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" justifyContent="center" gap={1}>
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() =>
                                  handleEditFlight(flight.flightNumber)
                                }
                              >
                                Edit
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() =>
                                  handleDeleteFlight(flight.flightNumber)
                                }
                              >
                                Delete
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={totalElements || 0}
                  page={filters.page}
                  onPageChange={handleChangePage}
                  rowsPerPage={filters.limit}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </>
            )}
          </CardContent>
        </Card>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            sx={{ width: "100%" }}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default AdminFlightsPage;
