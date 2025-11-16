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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAirportSuggestions,
  fetchFlights,
  selectairportSuggestion,
} from "./userSlice";

import TravellersClassSelector from "./components/TravellersClassSelector";

const FlightSearchUI = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const airportSuggestions = useSelector(selectairportSuggestion);

  const [anchorEl, setAnchorEl] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [autoType, setAutoType] = useState(""); // "from" or "to"

  // MASTER FORM DATA
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

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const clearAutoComplete = () => {
    dispatch(fetchAirportSuggestions([]));
    setActiveIndex(null);
  };

  //  AUTOCOMPLETE INPUT HANDLER
  const handleInputChange = (value, index, type) => {
    const key = type === "from" ? "sourceAirports" : "destinationAirports";

    const arr = formData[key] ? formData[key].split(",") : [];
    arr[index] = value;

    handleChange(key, arr.join(","));
    setActiveIndex(index);
    setAutoType(type);

    // 🔥 FIX: CLEAR suggestions when empty
    if (value.trim() === "") {
      dispatch(fetchAirportSuggestions([])); // clear suggestions
      setActiveIndex(null);
      return;
    }

    // Fetch suggestions only if 2+ chars
    if (value.length >= 2) {
      dispatch(
        fetchAirportSuggestions({
          type: type === "from" ? "source" : "destination",
          query: value,
        })
      );
    }
  };

  // SELECT AUTOCOMPLETE OPTION
  const selectAirport = (airport) => {
    if (!autoType || activeIndex === null) return;

    const key = autoType === "from" ? "sourceAirports" : "destinationAirports";

    const arr = formData[key] ? formData[key].split(",") : [];
    arr[activeIndex] = airport;

    handleChange(key, arr.join(","));

    // close dropdown
    setActiveIndex(null);
    setAutoType("");
    dispatch(fetchAirportSuggestions([]));
  };

  // ADD CITY ROW
  const addCityRow = () => {
    setFormData((prev) => ({
      ...prev,
      sourceAirports: prev.sourceAirports + ",",
      destinationAirports: prev.destinationAirports + ",",
      departureDates: prev.departureDates + ",",
    }));
  };

  // REMOVE CITY ROW
  const removeCityRow = (index) => {
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
  };

  // SEARCH BUTTON
  const handleSearch = async () => {
    if (!formData.sourceAirports || !formData.destinationAirports) {
      alert("Please enter both source and destination!");
      return;
    }

    const passengers =
      formData.travellers.adults +
      formData.travellers.children +
      formData.travellers.infants;

    const payload = {
      tripType: formData.tripType,
      sourceAirports: formData.sourceAirports,
      destinationAirports: formData.destinationAirports,
      departureDates: formData.departureDates,
      returnDate: formData.returnDate,
      passengers,
      specialFareType: formData.specialFareType,
    };

    try {
      await dispatch(fetchFlights(payload)).unwrap();
      navigate("/flight-search-results", {
        state: { searchParams: formData },
      });
    } catch (err) {
      alert("Failed to fetch flights.");
    }
  };

  // Update total passengers
  useEffect(() => {
    const p =
      formData.travellers.adults +
      formData.travellers.children +
      formData.travellers.infants;

    handleChange("passengers", p);
  }, [formData.travellers]);

  const sourceArr = formData.sourceAirports
    ? formData.sourceAirports.split(",")
    : [""];

  const destArr = formData.destinationAirports
    ? formData.destinationAirports.split(",")
    : [""];

  const depArr = formData.departureDates
    ? formData.departureDates.split(",")
    : [""];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 5,
        backgroundImage:
          "url(https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1920&q=80)",
        backgroundSize: "cover",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "80%",
          maxWidth: 1200,
          p: 3,
          borderRadius: 4,
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

        {/* MULTI CITY MODE */}
        {formData.tripType === "MULTI_CITY" ? (
          <>
            {sourceArr.map((src, index) => (
              <Grid
                container
                spacing={2}
                key={index}
                sx={{ mb: 1, alignItems: "center" }}
              >
                {/* FROM */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2">From</Typography>

                  <Box sx={{ position: "relative" }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={src || ""}
                      onChange={(e) =>
                        handleInputChange(e.target.value, index, "from")
                      }
                      placeholder="Enter origin"
                      onFocus={() => {
                        clearAutoComplete();
                        setAutoType("from");
                      }}
                      inputProps={{ autoComplete: "off" }}
                    />

                    {autoType === "from" &&
                      activeIndex === index &&
                      airportSuggestions.length > 0 && (
                        <Paper
                          sx={{
                            position: "absolute",
                            top: "42px",
                            left: 0,
                            right: 0,
                            zIndex: 999,
                            maxHeight: 200,
                            overflowY: "auto",
                          }}
                        >
                          {airportSuggestions.map((a, i) => (
                            <Box
                              key={i}
                              sx={{
                                p: 1,
                                cursor: "pointer",
                                "&:hover": { background: "#eee" },
                              }}
                              onClick={() => selectAirport(a)}
                            >
                              {a}
                            </Box>
                          ))}
                        </Paper>
                      )}
                  </Box>
                </Grid>

                {/* TO */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2">To</Typography>

                  <Box sx={{ position: "relative" }}>
                    <TextField
                      fullWidth
                      size="small"
                      value={destArr[index] || ""}
                      onChange={(e) =>
                        handleInputChange(e.target.value, index, "to")
                      }
                      placeholder="Enter destination"
                      onFocus={() => {
                        setAutoType("to");
                        clearAutoComplete();
                      }}
                      inputProps={{ autoComplete: "off" }}
                    />

                    {autoType === "to" &&
                      activeIndex === index &&
                      airportSuggestions.length > 0 && (
                        <Paper
                          sx={{
                            position: "absolute",
                            top: "42px",
                            left: 0,
                            right: 0,
                            zIndex: 999,
                            maxHeight: 200,
                            overflowY: "auto",
                          }}
                        >
                          {airportSuggestions.map((a, i) => (
                            <Box
                              key={i}
                              sx={{
                                p: 1,
                                cursor: "pointer",
                                "&:hover": { background: "#eee" },
                              }}
                              onClick={() => selectAirport(a)}
                            >
                              {a}
                            </Box>
                          ))}
                        </Paper>
                      )}
                  </Box>
                </Grid>

                {/* DATE */}
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2">Departure</Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    value={depArr[index] || ""}
                    onChange={(e) => {
                      const arr = [...depArr];
                      arr[index] = e.target.value;
                      handleChange("departureDates", arr.join(","));
                    }}
                  />
                </Grid>

                {/* REMOVE */}
                {index > 0 && (
                  <Grid item xs={12} sm={2}>
                    <Button color="error" onClick={() => removeCityRow(index)}>
                      ✕
                    </Button>
                  </Grid>
                )}
              </Grid>
            ))}

            <Button onClick={addCityRow} sx={{ mt: 1 }}>
              + Add Another City
            </Button>
          </>
        ) : (
          <>
            {/* ONE WAY / ROUND TRIP */}
            <Grid container spacing={2}>
              {/* From */}
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">From</Typography>

                <Box sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={sourceArr[0] || ""}
                    onChange={(e) =>
                      handleInputChange(e.target.value, 0, "from")
                    }
                    placeholder="Enter origin"
                    onFocus={() => {
                      setAutoType("from");
                      clearAutoComplete();
                    }}
                    inputProps={{ autoComplete: "off" }}
                  />

                  {autoType === "from" &&
                    activeIndex === 0 &&
                    airportSuggestions.length > 0 && (
                      <Paper
                        sx={{
                          position: "absolute",
                          top: "42px",
                          left: 0,
                          right: 0,
                          zIndex: 999,
                          maxHeight: 200,
                          overflowY: "auto",
                        }}
                      >
                        {airportSuggestions.map((a, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 1,
                              cursor: "pointer",
                              "&:hover": { background: "#eee" },
                            }}
                            onClick={() => selectAirport(a)}
                          >
                            {a}
                          </Box>
                        ))}
                      </Paper>
                    )}
                </Box>
              </Grid>

              {/* To */}
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">To</Typography>

                <Box sx={{ position: "relative" }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={destArr[0] || ""}
                    onChange={(e) => handleInputChange(e.target.value, 0, "to")}
                    placeholder="Enter destination"
                    onFocus={() => {
                      setAutoType("to");
                      clearAutoComplete();
                    }}
                    inputProps={{ autoComplete: "off" }}
                  />

                  {autoType === "to" &&
                    activeIndex === 0 &&
                    airportSuggestions.length > 0 && (
                      <Paper
                        sx={{
                          position: "absolute",
                          top: "42px",
                          left: 0,
                          right: 0,
                          zIndex: 999,
                          maxHeight: 200,
                          overflowY: "auto",
                        }}
                      >
                        {airportSuggestions.map((a, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 1,
                              cursor: "pointer",
                              "&:hover": { background: "#eee" },
                            }}
                            onClick={() => selectAirport(a)}
                          >
                            {a}
                          </Box>
                        ))}
                      </Paper>
                    )}
                </Box>
              </Grid>

              {/* Departure */}
              <Grid item xs={12} sm={3}>
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

              {/* Return */}
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2">Return</Typography>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  disabled={formData.tripType === "ONE_WAY"}
                  value={formData.returnDate}
                  onChange={(e) => handleChange("returnDate", e.target.value)}
                />
              </Grid>
            </Grid>
          </>
        )}

        {/* Travellers */}
        <Box sx={{ mt: 2 }}>
          <TravellersClassSelector
            formData={formData}
            setFormData={setFormData}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
          />
        </Box>

        {/* Special Fare */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2">Select a special fare</Typography>

          <ToggleButtonGroup
            color="primary"
            exclusive
            value={formData.specialFareType}
            onChange={(e, v) => v && handleChange("specialFareType", v)}
            sx={{ mt: 1 }}
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
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 5,
              borderRadius: "50px",
              fontWeight: "bold",
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
