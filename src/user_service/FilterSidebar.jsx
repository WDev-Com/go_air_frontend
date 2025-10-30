import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Slider,
  Checkbox,
  FormControlLabel,
  Grid,
  ToggleButton,
  Divider,
  Paper,
  Chip,
  Button,
} from "@mui/material";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import LightModeIcon from "@mui/icons-material/LightMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import CloseIcon from "@mui/icons-material/Close";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const FilterSidebar = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // 🔁 Keep local state synced with parent when form resets or new search happens
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // ⏱️ Auto-apply filters after 400ms debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 400);
    return () => clearTimeout(delay);
  }, [localFilters]);

  // 🔧 Update local filters
  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  // ❌ Remove applied filter
  const handleRemoveFilter = (key, value) => {
    if (key === "airlines") {
      const updatedAirlines = localFilters.airlines.filter((a) => a !== value);
      handleChange("airlines", updatedAirlines);
    } else {
      handleChange(key, null);
    }
  };

  const handleScrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  // 🟦 Collect applied filters for display
  const appliedFilters = [];
  if (localFilters.stop !== null)
    appliedFilters.push({
      key: "stop",
      value: localFilters.stop === 0 ? "Non Stop" : "1 Stop",
    });
  if (localFilters.airlines.length)
    localFilters.airlines.forEach((a) =>
      appliedFilters.push({ key: "airlines", value: a })
    );
  if (localFilters.departureType)
    appliedFilters.push({
      key: "departureType",
      value: localFilters.departureType,
    });
  if (localFilters.aircraftSize)
    appliedFilters.push({
      key: "aircraftSize",
      value: localFilters.aircraftSize,
    });

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        width: 320,
        borderRadius: 3,
        bgcolor: "#fff",
        height: "fit-content",
        position: "sticky",
        top: 80,
      }}
    >
      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Applied Filters
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {appliedFilters.map((f) => (
              <Chip
                key={`${f.key}-${f.value}`}
                label={`${f.value}`}
                onDelete={() => handleRemoveFilter(f.key, f.value)}
                deleteIcon={<CloseIcon />}
                sx={{
                  bgcolor: "#f0f0f0",
                  "& .MuiChip-deleteIcon": { color: "#555" },
                }}
              />
            ))}
          </Box>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Filters
      </Typography>

      {/* Stops */}
      <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 600 }}>
        Stops From Source
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={localFilters.stop === 0}
            onChange={() =>
              handleChange("stop", localFilters.stop === 0 ? null : 0)
            }
          />
        }
        label="Non Stop"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={localFilters.stop === 1}
            onChange={() =>
              handleChange("stop", localFilters.stop === 1 ? null : 1)
            }
          />
        }
        label="1 Stop"
      />

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        One Way Price
      </Typography>
      <Slider
        value={[localFilters.minPrice, localFilters.maxPrice]}
        onChange={(e, newValue) => {
          const [min, max] = newValue;
          handleChange("minPrice", min);
          handleChange("maxPrice", max);
        }}
        min={3000}
        max={40000}
        valueLabelDisplay="auto"
        sx={{ color: "#1976d2", mt: 1 }}
      />
      <Typography variant="body2" color="text.secondary">
        ₹{localFilters.minPrice} - ₹{localFilters.maxPrice}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Airlines */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Airlines
      </Typography>
      {[
        "IndiGo",
        "SpiceJet",
        "Akasa Air",
        "Air India",
        "Air India Express",
      ].map((airlines) => (
        <FormControlLabel
          key={airlines}
          control={
            <Checkbox
              checked={localFilters.airlines.includes(airlines)}
              onChange={(e) => {
                const updated = e.target.checked
                  ? [...localFilters.airlines, airlines]
                  : localFilters.airlines.filter((a) => a !== airlines);
                handleChange("airlines", updated);
              }}
            />
          }
          label={airlines}
        />
      ))}

      <Divider sx={{ my: 2 }} />

      {/* Departure Time */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Departure From Source
      </Typography>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {[
          {
            label: "Early Morning",
            value: "EARLY_MORNING",
            icon: <WbTwilightIcon />,
          },
          { label: "Morning", value: "MORNING", icon: <LightModeIcon /> },
          { label: "Afternoon", value: "AFTERNOON", icon: <WbSunnyIcon /> },
          { label: "Late", value: "LATE", icon: <NightsStayIcon /> },
        ].map((slot) => (
          <Grid item xs={6} key={slot.value}>
            <ToggleButton
              value={slot.value}
              selected={localFilters.departureType === slot.value}
              onChange={() =>
                handleChange(
                  "departureType",
                  localFilters.departureType === slot.value ? null : slot.value
                )
              }
              fullWidth
              size="small"
              sx={{
                borderRadius: 2,
                borderColor: "#ccc",
                color:
                  localFilters.departureType === slot.value
                    ? "#1976d2"
                    : "text.primary",
                bgcolor:
                  localFilters.departureType === slot.value
                    ? "#e3f2fd"
                    : "#fff",
                "&:hover": { bgcolor: "#f0f4ff" },
              }}
            >
              {slot.icon}
            </ToggleButton>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      {/* Aircraft Size */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Aircraft Size
      </Typography>
      {["LIGHT", "MEDIUM", "LARGE", "JUMBO"].map((size) => (
        <FormControlLabel
          key={size}
          control={
            <Checkbox
              checked={localFilters.aircraftSize === size}
              onChange={() =>
                handleChange(
                  "aircraftSize",
                  localFilters.aircraftSize === size ? null : size
                )
              }
            />
          }
          label={size}
        />
      ))}

      <Divider sx={{ my: 2 }} />

      <Button
        fullWidth
        variant="text"
        startIcon={<ArrowUpwardIcon />}
        onClick={handleScrollToTop}
        sx={{
          textTransform: "none",
          color: "#1976d2",
          fontWeight: 600,
          "&:hover": { bgcolor: "#e3f2fd" },
        }}
      >
        Scroll to Top
      </Button>
    </Paper>
  );
};

export default FilterSidebar;
