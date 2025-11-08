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
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFlights,
  selectFlights,
  selectLoading,
  selectError,
  selectTotalElements,
} from "./adminSlice";
import FilterPanel from "./FilterPanel";

const AdminFlightsPage = () => {
  const dispatch = useDispatch();
  const flights = useSelector(selectFlights);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const totalElements = useSelector(selectTotalElements);

  const [filters, setFilters] = useState({
    airlines: [],
    sourceAirport: "",
    destinationAirport: "",
    departureDate: "",
    retDate: "",
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

  // Handle changes in filter inputs
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Apply filters
  const handleSubmit = () => {
    setFilters((prev) => ({ ...prev, page: 0 })); // Reset page when filters applied
    dispatch(fetchFlights({ ...filters, page: 0 }));
  };

  // Clear filters
  const handleClear = () => {
    setFilters({
      airlines: [],
      sourceAirport: "",
      destinationAirport: "",
      departureDate: "",
      retDate: "",
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
    dispatch(fetchFlights({ ...filters, page: 0 }));
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

  // Fetch flights on filters change
  useEffect(() => {
    dispatch(fetchFlights(filters));
  }, [dispatch, filters]);

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
      </Box>
    </>
  );
};

export default AdminFlightsPage;
