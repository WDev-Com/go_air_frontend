import React from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Divider,
} from "@mui/material";

const bookingTypes = ["REFUNDABLE", "NON_REFUNDABLE"];
const departureTypes = ["EARLY_MORNING", "MORNING", "AFTERNOON", "LATE"];
const specialFareTypes = [
  "REGULAR",
  "STUDENT",
  "ARMED_FORCES",
  "SENIOR_CITIZEN",
  "DOCTOR_AND_NURSES",
  "FAMILY",
];
const aircraftSizes = ["LIGHT", "MEDIUM", "LARGE", "JUMBO"];

const stops = [0, 1];
const airlinesList = ["IndiGo", "Air India", "Vistara", "SpiceJet", "Go Air"];

const FilterPanel = ({ handleChange, handleSubmit, handleClear, filters }) => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={2}>
        Filter Flights
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={2} alignItems="center">
        {/* Airlines (array) */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Airlines</InputLabel>
            <Select
              multiple
              value={filters.airlines[0]}
              onChange={(e) => handleChange("airlines", e.target.value)}
              input={<OutlinedInput label="Airlines" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {airlinesList.map((airline) => (
                <MenuItem key={airline} value={airline}>
                  <Checkbox checked={filters.airlines?.includes(airline)} />
                  <ListItemText primary={airline} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Source Airport */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Source Airport"
            value={filters.sourceAirport || ""}
            onChange={(e) => handleChange("sourceAirport", e.target.value)}
            fullWidth
          />
        </Grid>

        {/* Destination Airport */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Destination Airport"
            value={filters.destinationAirport || ""}
            onChange={(e) => handleChange("destinationAirport", e.target.value)}
            fullWidth
          />
        </Grid>

        {/* Departure Date */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Departure Date"
            type="date"
            value={filters.departureDate || ""}
            onChange={(e) => handleChange("departureDate", e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Return Date */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Return Date"
            type="date"
            value={filters.retDate || ""}
            onChange={(e) => handleChange("retDate", e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Stops */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            label="Stops"
            value={filters.stop ?? ""}
            onChange={(e) => handleChange("stop", e.target.value)}
            fullWidth
          >
            {stops.map((s) => (
              <MenuItem key={s} value={s}>
                {s === 0 ? "Non-stop" : `${s} Stop`}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Booking Type */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            label="Booking Type"
            value={filters.bookingType || ""}
            onChange={(e) => handleChange("bookingType", e.target.value)}
            fullWidth
          >
            {bookingTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Departure Type */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            label="Departure Type"
            value={filters.departureType || ""}
            onChange={(e) => handleChange("departureType", e.target.value)}
            fullWidth
          >
            {departureTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Price Range */}
        <Grid item xs={12} sm={12} md={3}>
          <Typography variant="body2" gutterBottom>
            Price Range (₹)
          </Typography>
          <Slider
            value={[filters.minPrice ?? 0, filters.maxPrice ?? 100000]}
            onChange={(e, newValue) => {
              handleChange("minPrice", newValue[0]);
              handleChange("maxPrice", newValue[1]);
            }}
            min={0}
            max={100000}
            step={1000}
            valueLabelDisplay="auto"
          />
        </Grid>

        {/* Aircraft Size */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            label="Aircraft Size"
            value={filters.aircraftSize || ""}
            onChange={(e) => handleChange("aircraftSize", e.target.value)}
            fullWidth
          >
            {aircraftSizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Special Fare */}
        <Grid item xs={12} sm={6} md={1.5}>
          <TextField
            select
            label="Special Fare"
            value={filters.specialFareType || ""}
            onChange={(e) => handleChange("specialFareType", e.target.value)}
            fullWidth
          >
            {specialFareTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12} sm={6} md={3} display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            APPLY FILTERS
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            fullWidth
          >
            CLEAR
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterPanel;
