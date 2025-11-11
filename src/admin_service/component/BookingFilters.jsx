import React from "react";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";

const tripTypes = ["ONE_WAY", "ROUND_TRIP", "MULTI_CITY"];
const bookingStatuses = ["PENDING", "CONFIRMED", "CANCELLED"];
const specialFareTypes = [
  "REGULAR",
  "STUDENT",
  "ARMED_FORCES",
  "SENIOR_CITIZEN",
  "DOCTOR_AND_NURSES",
  "FAMILY",
];
const journeyStatuses = ["SCHEDULED", "IN_PROGRESS", "COMPLETED"];

const BookingFilters = ({ filters, handleFilterChange }) => {
  return (
    <Box
      sx={{
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        backgroundColor: "#fafafa",
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          mb: 2,
          color: "#333",
          borderBottom: "2px solid #1976d2",
          display: "inline-block",
          pb: 0.5,
        }}
      >
        Booking Filters
      </Typography>

      {/* Filter Inputs */}
      <Grid container spacing={2}>
        {/* Booking No */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            label="Booking No"
            variant="outlined"
            fullWidth
            value={filters.bookingNo}
            onChange={(e) => handleFilterChange("bookingNo", e.target.value)}
          />
        </Grid>

        {/* Flight Number */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            label="Flight Number"
            variant="outlined"
            fullWidth
            value={filters.flightNumber}
            onChange={(e) => handleFilterChange("flightNumber", e.target.value)}
          />
        </Grid>

        {/* User */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <TextField
            label="User"
            variant="outlined"
            fullWidth
            value={filters.user}
            onChange={(e) => handleFilterChange("user", e.target.value)}
          />
        </Grid>

        {/* Trip Type */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl sx={{ minWidth: 110 }} fullWidth>
            <InputLabel>Trip Type</InputLabel>
            <Select
              value={filters.tripType}
              onChange={(e) => handleFilterChange("tripType", e.target.value)}
              input={<OutlinedInput label="Trip Type" />}
            >
              {tripTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Booking Status */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl sx={{ minWidth: 90 }} fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              input={<OutlinedInput label="Status" />}
            >
              {bookingStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Special Fare Type */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl sx={{ minWidth: 180 }} fullWidth>
            <InputLabel>Special Fare Type</InputLabel>
            <Select
              value={filters.specialFareType}
              onChange={(e) =>
                handleFilterChange("specialFareType", e.target.value)
              }
              input={<OutlinedInput label="Special Fare Type" />}
            >
              {specialFareTypes.map((fare) => (
                <MenuItem key={fare} value={fare}>
                  {fare.replaceAll("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Journey Status */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <FormControl sx={{ minWidth: 150 }} fullWidth>
            <InputLabel>Journey Status</InputLabel>
            <Select
              value={filters.journeyStatus}
              onChange={(e) =>
                handleFilterChange("journeyStatus", e.target.value)
              }
              input={<OutlinedInput label="Journey Status" />}
            >
              {journeyStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.replace("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BookingFilters;
