import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Popover,
  Modal,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import { fetchAirportSuggestions, selectairportSuggestion } from "../userSlice";
import TravellersClassSelector from "./TravellersClassSelector";
// Trip type display mapping
const tripTypeMap = {
  ONE_WAY: "One Way",
  ROUND_TRIP: "Round Trip",
  MULTI_CITY: "Multi City",
};

const EditableSummaryBar = ({ values = {}, onApply }) => {
  const [local, setLocal] = useState(() => ({
    tripType: values.tripType || "ONE_WAY",
    sourceAirports: values.sourceAirports || "",
    destinationAirports: values.destinationAirports || "",
    departureDates: values.departureDates || "",
    returnDate: values.returnDate || "",
    specialFareType: values.specialFareType || "REGULAR",
    travellers: values.travellers || {
      adults: 1,
      children: 0,
      infants: 0,
      travelClass: "Economy/Premium Economy",
    },
    passengers: 1,
    travelClass: values.travelClass || "Economy/Premium Economy",
  }));

  const [travAnchor, setTravAnchor] = useState(null);
  const [editingOpen, setEditingOpen] = useState(false);

  const dispatch = useDispatch();
  const airportSuggestions = useSelector(selectairportSuggestion);

  const [anchorEl, setAnchorEl] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [autoType, setAutoType] = useState(""); // "from" or "to"

  // Clear autocomplete
  const clearAutoComplete = () => {
    dispatch(fetchAirportSuggestions([]));
    setActiveIndex(null);
    setAnchorEl(null);
    setAutoType("");
  };
  // console.log("airportSuggestions :", airportSuggestions);

  // Handle Input change
  const handleInputChange = (value, index, type, event) => {
    const key = type === "from" ? "sourceAirports" : "destinationAirports";
    const arr = local[key] ? local[key].split(",") : [];
    arr[index] = value;

    handleChange(key, arr.join(","));
    setActiveIndex(index);
    setAutoType(type);

    // FIX — attach autocomplete popover to the active input
    // prefer using event.currentTarget if available (the input element)
    if (event && event.currentTarget) {
      setAnchorEl(event.currentTarget);
    } else if (event && event.target) {
      setAnchorEl(event.target);
    }

    if (value.trim() === "") {
      clearAutoComplete();
      return;
    }

    if (value.length >= 2) {
      dispatch(
        fetchAirportSuggestions({
          type: type === "from" ? "source" : "destination",
          query: value,
        })
      );
    }
  };

  // Select airport from suggestion
  const selectAirport = (airport) => {
    if (!autoType || activeIndex === null) return;

    const key = autoType === "from" ? "sourceAirports" : "destinationAirports";
    const arr = local[key] ? local[key].split(",") : [];
    arr[activeIndex] = airport;

    handleChange(key, arr.join(","));
    clearAutoComplete();
  };

  useEffect(() => {
    const isDifferent = JSON.stringify(values) !== JSON.stringify(local);
    if (isDifferent) {
      const travellers = values.travellers || local.travellers;
      const totalPassengers =
        (travellers.adults || 0) +
        (travellers.children || 0) +
        (travellers.infants || 0);

      setLocal((prev) => ({
        ...prev,
        ...values,
        travellers,
        passengers: totalPassengers || 1,
        travelClass:
          travellers.travelClass ||
          values.travelClass ||
          prev.travelClass ||
          "Economy/Premium Economy",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const handleChange = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  let totalPassengers;
  const handleTravellerChange = (field, value) => {
    setLocal((prev) => {
      const updatedTravellers = {
        ...prev.travellers,
        [field]: value,
      };
      totalPassengers =
        (updatedTravellers.adults || 0) +
        (updatedTravellers.children || 0) +
        (updatedTravellers.infants || 0);

      return {
        ...prev,
        travellers: updatedTravellers,
        passengers: totalPassengers,
      };
    });
  };

  const handleTravelClassChange = (value) => {
    setLocal((prev) => ({
      ...prev,
      travellers: { ...prev.travellers, travelClass: value },
      travelClass: value,
    }));
  };

  const handleApply = () => {
    const updatedData = {
      ...local,
      passengers: local.passengers,
      travellers: {
        ...local.travellers,
        travelClass: local.travelClass,
      },
    };
    onApply(updatedData);
    setEditingOpen(false);
  };

  const sourceCities = local.sourceAirports
    ? local.sourceAirports.split(",")
    : [""];
  const destCities = local.destinationAirports
    ? local.destinationAirports.split(",")
    : [""];
  const departDates = local.departureDates
    ? local.departureDates.split(",")
    : [""];

  const updateMultiCityField = (type, index, value) => {
    const arr =
      type === "sourceAirports"
        ? sourceCities
        : type === "destinationAirports"
        ? destCities
        : departDates;
    arr[index] = value;
    handleChange(type, arr.join(","));
  };

  const removeMultiCityRow = (index) => {
    const newSource = [...sourceCities];
    const newDest = [...destCities];
    const newDepart = [...departDates];

    newSource.splice(index, 1);
    newDest.splice(index, 1);
    newDepart.splice(index, 1);

    setLocal((prev) => ({
      ...prev,
      sourceAirports: newSource.join(","),
      destinationAirports: newDest.join(","),
      departureDates: newDepart.join(","),
    }));
  };

  const addMultiCityRow = () => {
    setLocal((prev) => ({
      ...prev,
      sourceAirports: prev.sourceAirports ? prev.sourceAirports + "," : ",",
      destinationAirports: prev.destinationAirports
        ? prev.destinationAirports + ","
        : ",",
      departureDates: prev.departureDates ? prev.departureDates + "," : ",",
    }));
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        bgcolor: "#ffffff",
      }}
    >
      {/* Summary Bar */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          bgcolor: "#f5f6fa",
          borderRadius: 2,
          px: 3,
          py: 2,
          mb: 2,
          cursor: "pointer",
          userSelect: "none",
          position: "relative",
          zIndex: 2,
        }}
        onClick={() => setEditingOpen(true)}
      >
        <Typography sx={{ minWidth: 100, fontWeight: "bold" }}>
          {tripTypeMap[local.tripType] || "Trip Type"}
        </Typography>
        <Typography sx={{ minWidth: 210 }}>
          {local.tripType === "MULTI_CITY"
            ? sourceCities
                .map(
                  (from, i) =>
                    `${from || "Origin"} ➔ ${destCities[i] || "Destination"} (${
                      departDates[i] || "Date"
                    })`
                )
                .join(", ")
            : `${local.sourceAirports || "Origin"} ➔ ${
                local.destinationAirports || "Destination"
              } (${local.departureDates || "Date"})`}
        </Typography>
        {local.tripType === "ROUND_TRIP" && (
          <Typography sx={{ minWidth: 170 }}>
            Return: {local.returnDate || "Not Chosen"}
          </Typography>
        )}
        <Typography sx={{ minWidth: 190 }}>
          {`${local.passengers} Passenger${local.passengers > 1 ? "s" : ""} — ${
            local.travelClass
          }`}
        </Typography>
        <ToggleButtonGroup
          value={local.specialFareType}
          exclusive
          size="small"
          sx={{ minWidth: 260, bgcolor: "#fff", borderRadius: 2 }}
          onChange={(e, val) => val && handleChange("specialFareType", val)}
        >
          <ToggleButton value="REGULAR">Regular</ToggleButton>
          <ToggleButton value="STUDENT">Student</ToggleButton>
          <ToggleButton value="ARMED_FORCES">Armed Forces</ToggleButton>
          <ToggleButton value="SENIOR_CITIZEN">Senior Citizen</ToggleButton>
          <ToggleButton value="DOCTOR_AND_NURSES">Doctor & Nurses</ToggleButton>
          <ToggleButton value="FAMILY">Family</ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 120, borderRadius: 2 }}
          onClick={(e) => {
            e.stopPropagation();
            handleApply();
          }}
        >
          SEARCH
        </Button>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setEditingOpen(true);
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      {/* Overlay Edit Panel */}
      <Modal
        open={editingOpen}
        onClose={() => setEditingOpen(false)}
        aria-labelledby="edit-modal-title"
        closeAfterTransition
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "95%", sm: 600, lg: 700 },
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 3,
            zIndex: 1300,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Trip Type */}
            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Trip Type</Typography>
              <TextField
                select
                fullWidth
                size="small"
                variant="filled"
                value={local.tripType}
                onChange={(e) => handleChange("tripType", e.target.value)}
              >
                <MenuItem value="ONE_WAY">One Way</MenuItem>
                <MenuItem value="ROUND_TRIP">Round Trip</MenuItem>
                <MenuItem value="MULTI_CITY">Multi City</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Dynamic fields for MULTI_CITY */}
          <Box mt={2}>
            {local.tripType === "MULTI_CITY" ? (
              <>
                {sourceCities.map((fromCity, index) => (
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    key={index}
                    sx={{ mb: 1 }}
                  >
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">From</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        variant="filled"
                        value={fromCity.trim()}
                        // onChange={(e) =>
                        //   updateMultiCityField(
                        //     "sourceAirports",
                        //     index,
                        //     e.target.value
                        //   )
                        // }
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "from", e)
                        }
                        // removed stale onClick anchor
                        placeholder="Enter origin"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">To</Typography>
                      <TextField
                        fullWidth
                        size="small"
                        variant="filled"
                        value={destCities[index]?.trim() || ""}
                        // onChange={(e) =>
                        //   updateMultiCityField(
                        //     "destinationAirports",
                        //     index,
                        //     e.target.value
                        //   )
                        // }
                        onChange={(e) =>
                          handleInputChange(e.target.value, index, "to", e)
                        }
                        // removed stale onClick anchor
                        placeholder="Enter destination"
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2">Departure</Typography>
                      <TextField
                        fullWidth
                        type="date"
                        size="small"
                        variant="filled"
                        InputLabelProps={{ shrink: true }}
                        value={departDates[index]?.trim() || ""}
                        onChange={(e) =>
                          updateMultiCityField(
                            "departureDates",
                            index,
                            e.target.value
                          )
                        }
                      />
                    </Grid>

                    {index > 0 && (
                      <Grid item xs={12} sm={12}>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeMultiCityRow(index)}
                          sx={{ mt: 3, borderRadius: 2 }}
                        >
                          ✕
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  onClick={addMultiCityRow}
                  sx={{ mt: 1, textTransform: "none", borderRadius: 2 }}
                >
                  + Add Another City
                </Button>
              </>
            ) : (
              <Grid container spacing={2} alignItems="center" mt={1}>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption">From</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="filled"
                    value={local.sourceAirports}
                    // onChange={(e) =>
                    //   handleChange("sourceAirports", e.target.value)
                    // }
                    onChange={(e) =>
                      handleInputChange(e.target.value, 0, "from", e)
                    }
                    // removed stale onClick anchor
                    placeholder="City, Airport"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="caption">To</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    variant="filled"
                    value={local.destinationAirports}
                    // onChange={(e) =>
                    //   handleChange("destinationAirports", e.target.value)
                    // }
                    onChange={(e) =>
                      handleInputChange(e.target.value, 0, "to", e)
                    }
                    // removed stale onClick anchor
                    placeholder="City, Airport"
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="caption">Depart</Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    variant="filled"
                    value={local.departureDates}
                    onChange={(e) =>
                      handleChange("departureDates", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant="caption">Return</Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    variant="filled"
                    value={local.returnDate}
                    onChange={(e) => handleChange("returnDate", e.target.value)}
                    disabled={local.tripType === "ONE_WAY"}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>

          {/* Passengers, Fare Type, Search Button remain same */}
          <Grid container spacing={2} alignItems="center" mt={2}>
            <TravellersClassSelector
              formData={local}
              anchorEl={travAnchor}
              setAnchorEl={setTravAnchor}
              onTravellerChange={handleTravellerChange}
              onTravelClassChange={handleTravelClassChange}
            />

            <Grid item xs={12} sm={6}>
              <Typography variant="caption">Fare Type</Typography>
              <ToggleButtonGroup
                value={local.specialFareType}
                exclusive
                size="small"
                sx={{ mt: 1 }}
                onChange={(e, val) =>
                  val && handleChange("specialFareType", val)
                }
              >
                <ToggleButton value="REGULAR">Regular</ToggleButton>
                <ToggleButton value="STUDENT">Student</ToggleButton>
                <ToggleButton value="ARMED_FORCES">Armed Forces</ToggleButton>
                <ToggleButton value="SENIOR_CITIZEN">
                  Senior Citizen
                </ToggleButton>
                <ToggleButton value="DOCTOR_AND_NURSES">
                  Doctor & Nurses
                </ToggleButton>
                <ToggleButton value="FAMILY">Family</ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ minWidth: 120, borderRadius: 2 }}
              onClick={handleApply}
            >
              Apply
            </Button>
            <Button
              variant="outlined"
              sx={{ borderRadius: 2, ml: 2 }}
              onClick={() => setEditingOpen(false)}
            >
              Cancel
            </Button>
          </Box>

          {/* Auto Complete Component */}
          <Popover
            open={Boolean(anchorEl && airportSuggestions.length)}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null);
              // don't forget to clear suggestions too
              clearAutoComplete();
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            disableRestoreFocus
            disableAutoFocus
            disableEnforceFocus
          >
            <Box sx={{ p: 1, width: 250, maxHeight: 200, overflowY: "auto" }}>
              {airportSuggestions.map((item, idx) => (
                <MenuItem
                  key={idx}
                  onClick={() =>
                    // if item is a string or object, tries to support both shapes:
                    selectAirport(
                      typeof item === "string" ? item : item.airportName || item
                    )
                  }
                >
                  {typeof item === "string"
                    ? item
                    : `${item.airportName || item} — ${item.cityName || ""}`}
                </MenuItem>
              ))}

              {!airportSuggestions.length && (
                <Typography sx={{ p: 1, fontSize: 12 }}>
                  No airports found
                </Typography>
              )}
            </Box>
          </Popover>
        </Box>
      </Modal>
    </Paper>
  );
};

export default EditableSummaryBar;
