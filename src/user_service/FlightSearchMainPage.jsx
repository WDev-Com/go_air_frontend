import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Popover,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlights, selectFlights } from "./userSlice";

const FlightSearchUI = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ All form fields in one state
  const [formData, setFormData] = useState({
    tripType: "ONE_WAY",
    sourceAirports: "",
    destinationAirports: "",
    departureDates: "",
    returnDate: "",
    specialFareType: "REGULAR",
    travellers: {
      adults: 1,
      children: 0,
      infants: 0,
      travelClass: "Economy",
    },
    passengers: 1,
  });

  // ✅ Common change handler
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Search handler
  const handleSearch = async () => {
    if (!formData.sourceAirports || !formData.destinationAirports) {
      alert("Please select both source and destination airports.");
      return;
    }

    const totalPassengers =
      formData.travellers.adults +
      formData.travellers.children +
      formData.travellers.infants;

    const flightSearchData = {
      tripType: formData.tripType,
      sourceAirports: formData.sourceAirports,
      destinationAirports: formData.destinationAirports,
      departureDates: formData.departureDates,
      returnDate: formData.returnDate,
      passengers: totalPassengers,
      specialFareType: formData.specialFareType,
    };

    // console.log("Sending to fetchFlights:", flightSearchData);
    try {
      await dispatch(fetchFlights(flightSearchData)).unwrap();
      navigate("/flight-search-results", {
        state: { searchParams: formData },
      });
    } catch (error) {
      console.error("Error fetching flights:", error);
      alert("Failed to fetch flights. Please try again.");
    }
  };

  // Update passengers whenever travellers change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      passengers:
        prev.travellers.adults +
        prev.travellers.children +
        prev.travellers.infants,
    }));
  }, [formData.travellers]);

  const flights = useSelector(selectFlights);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 5,
        backgroundImage:
          "url(https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1920&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "80%",
          maxWidth: 1200,
          borderRadius: 4,
          p: 3,
          bgcolor: "rgba(255,255,255,0.95)",
        }}
      >
        {/* Trip Type */}
        <RadioGroup
          row
          value={formData.tripType}
          onChange={(e) => handleChange("tripType", e.target.value)}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="ONE_WAY"
            control={<Radio />}
            label="One Way"
          />
          <FormControlLabel
            value="ROUND_TRIP"
            control={<Radio />}
            label="Round Trip"
          />
          <FormControlLabel
            value="MULTI_CITY"
            control={<Radio />}
            label="Multi City"
          />
        </RadioGroup>

        {/* Main Fields */}
        <Grid container spacing={2} alignItems="center">
          {formData.tripType === "MULTI_CITY" ? (
            <>
              {formData.sourceAirports.split(",").map((fromCity, index) => (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  key={index}
                  sx={{ mb: 1 }}
                >
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2">From</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={fromCity.trim()}
                      onChange={(e) => {
                        const fromArr = formData.sourceAirports.split(",");
                        fromArr[index] = e.target.value;
                        handleChange("sourceAirports", fromArr.join(","));
                      }}
                      placeholder="Enter origin"
                    />
                  </Grid>

                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2">To</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={
                        formData.destinationAirports
                          .split(",")
                          [index]?.trim() || ""
                      }
                      onChange={(e) => {
                        const toArr = formData.destinationAirports.split(",");
                        toArr[index] = e.target.value;
                        handleChange("destinationAirports", toArr.join(","));
                      }}
                      placeholder="Enter destination"
                    />
                  </Grid>

                  <Grid item xs={12} sm={2}>
                    <Typography variant="subtitle2">Departure</Typography>
                    <TextField
                      fullWidth
                      type="date"
                      size="small"
                      value={
                        formData.departureDates.split(",")[index]?.trim() || ""
                      }
                      onChange={(e) => {
                        const depArr = formData.departureDates.split(",");
                        depArr[index] = e.target.value;
                        handleChange("departureDates", depArr.join(","));
                      }}
                    />
                  </Grid>

                  {index > 0 && (
                    <Grid item xs={12} sm={2}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                          const fromArr = formData.sourceAirports.split(",");
                          const toArr = formData.destinationAirports.split(",");
                          const depArr = formData.departureDates.split(",");

                          fromArr.splice(index, 1);
                          toArr.splice(index, 1);
                          depArr.splice(index, 1);

                          setFormData((prev) => ({
                            ...prev,
                            sourceAirports: fromArr.join(","),
                            destinationAirports: toArr.join(","),
                            departureDates: depArr.join(","),
                          }));
                        }}
                        sx={{ mt: 3 }}
                      >
                        ✕
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ))}

              <Button
                variant="outlined"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    sourceAirports: prev.sourceAirports
                      ? prev.sourceAirports + ","
                      : ",",
                    destinationAirports: prev.destinationAirports
                      ? prev.destinationAirports + ","
                      : ",",
                    departureDates: prev.departureDates
                      ? prev.departureDates + ","
                      : ",",
                  }));
                }}
                sx={{ mt: 1, textTransform: "none" }}
              >
                + Add Another City
              </Button>
            </>
          ) : (
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">From</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.sourceAirports}
                  onChange={(e) =>
                    handleChange("sourceAirports", e.target.value)
                  }
                  placeholder="Enter origin"
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">To</Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={formData.destinationAirports}
                  onChange={(e) =>
                    handleChange("destinationAirports", e.target.value)
                  }
                  placeholder="Enter destination"
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle2">Departure</Typography>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  value={formData.departureDates}
                  onChange={(e) =>
                    handleChange("departureDates", e.target.value)
                  }
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <Typography variant="subtitle2">Return</Typography>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  value={formData.returnDate}
                  disabled={formData.tripType === "ONE_WAY"}
                  onChange={(e) => handleChange("returnDate", e.target.value)}
                />
              </Grid>
            </Grid>
          )}

          {/* Travellers & Class */}
          <Grid item xs={12} sm={2}>
            <Typography variant="subtitle2">Travellers & Class</Typography>
            <Button
              variant="outlined"
              fullWidth
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                justifyContent: "space-between",
                textTransform: "none",
                fontSize: "0.9rem",
              }}
            >
              {`${
                formData.travellers.adults +
                formData.travellers.children +
                formData.travellers.infants
              } Traveller${
                formData.travellers.adults +
                  formData.travellers.children +
                  formData.travellers.infants >
                1
                  ? "s"
                  : ""
              }, ${formData.travellers.travelClass}`}
            </Button>

            {/* Travellers Popover */}
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Box sx={{ p: 2, width: 320 }}>
                {["adults", "children", "infants"].map((type) => (
                  <Box key={type} sx={{ mb: 2 }}>
                    <Typography fontWeight="bold">
                      {type === "adults"
                        ? "ADULTS (12y+)"
                        : type === "children"
                        ? "CHILDREN (2y - 12y)"
                        : "INFANTS (below 2y)"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {[...Array(type === "adults" ? 9 : 7).keys()].map(
                        (num) => (
                          <Button
                            key={num}
                            variant={
                              formData.travellers[type] === num
                                ? "contained"
                                : "outlined"
                            }
                            size="small"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                travellers: { ...prev.travellers, [type]: num },
                              }))
                            }
                            sx={{ borderRadius: 2, minWidth: 36 }}
                          >
                            {num}
                          </Button>
                        )
                      )}
                    </Box>
                  </Box>
                ))}

                <Typography fontWeight="bold" sx={{ mb: 1 }}>
                  CHOOSE TRAVEL CLASS
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {[
                    "Economy",
                    "Premium Economy",
                    "Business",
                    "First Class",
                  ].map((cls) => (
                    <Button
                      key={cls}
                      variant={
                        formData.travellers.travelClass === cls
                          ? "contained"
                          : "outlined"
                      }
                      size="small"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          travellers: {
                            ...prev.travellers,
                            travelClass: cls,
                          },
                        }))
                      }
                      sx={{ borderRadius: 3, textTransform: "none" }}
                    >
                      {cls}
                    </Button>
                  ))}
                </Box>

                <Box sx={{ textAlign: "right", mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => setAnchorEl(null)}
                    sx={{
                      borderRadius: "999px",
                      px: 3,
                      textTransform: "none",
                    }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Popover>
          </Grid>
        </Grid>

        {/* Special Fare */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select a special fare
          </Typography>
          <ToggleButtonGroup
            color="primary"
            value={formData.specialFareType}
            exclusive
            onChange={(e, val) => val && handleChange("specialFareType", val)}
            sx={{
              flexWrap: "wrap",
              gap: 1,
              "& .MuiToggleButton-root": {
                borderRadius: 3,
                textTransform: "none",
              },
            }}
          >
            <ToggleButton value="REGULAR">Regular</ToggleButton>
            <ToggleButton value="STUDENT">Student</ToggleButton>
            <ToggleButton value="ARMED_FORCES">Armed Forces</ToggleButton>
            <ToggleButton value="SENIOR_CITIZEN">Senior Citizen</ToggleButton>
            <ToggleButton value="DOCTOR_AND_NURSES">
              Doctor & Nurses
            </ToggleButton>
            <ToggleButton value="FAMILY">Family</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Search Button */}
        <Box textAlign="center" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: "999px",
              px: 6,
              py: 1.2,
              fontWeight: "bold",
              bgcolor: "#1976d2",
              "&:hover": { bgcolor: "#115293" },
            }}
            onClick={handleSearch}
          >
            SEARCH
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FlightSearchUI;
