// TravellersClassSelector.jsx
import React from "react";
import { Box, Button, Grid, Typography, Popover } from "@mui/material";

const TravellersClassSelector = ({
  formData,
  setFormData, // optional (old usage)
  onTravellerChange, // optional (new usage)
  onTravelClassChange, // optional (new usage)
  anchorEl,
  setAnchorEl,
}) => {
  const totalTravellers =
    formData.travellers.adults +
    formData.travellers.children +
    formData.travellers.infants;

  // ---------- INTERNAL HANDLERS (AUTO-DECIDE WHICH METHOD TO USE) ----------
  const updateTraveller = (type, value) => {
    if (onTravellerChange) {
      onTravellerChange(type, value); // new
    } else if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        travellers: { ...prev.travellers, [type]: value },
      })); // old
    }
  };

  const updateTravelClass = (cls) => {
    if (onTravelClassChange) {
      onTravelClassChange(cls); // new
    } else if (setFormData) {
      setFormData((prev) => ({
        ...prev,
        travellers: { ...prev.travellers, travelClass: cls },
      })); // old
    }
  };

  return (
    <Grid item sx={{ width: 250 }} xs={12} sm={2}>
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
        {`${totalTravellers} Traveller${totalTravellers > 1 ? "s" : ""}, ${
          formData.travellers.travelClass
        }`}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, width: 320 }}>
          {/* Passenger Count UI */}
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
                {[...Array(type === "adults" ? 9 : 7).keys()].map((num) => (
                  <Button
                    key={num}
                    variant={
                      formData.travellers[type] === num
                        ? "contained"
                        : "outlined"
                    }
                    size="small"
                    onClick={() => updateTraveller(type, num)}
                    sx={{ borderRadius: 2, minWidth: 36 }}
                  >
                    {num}
                  </Button>
                ))}
              </Box>
            </Box>
          ))}

          {/* Travel Class Section */}
          <Typography fontWeight="bold" sx={{ mb: 1 }}>
            CHOOSE TRAVEL CLASS
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {["Economy", "Premium Economy", "Business", "First Class"].map(
              (cls) => (
                <Button
                  key={cls}
                  variant={
                    formData.travellers.travelClass === cls
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() => updateTravelClass(cls)}
                  sx={{ borderRadius: 3, textTransform: "none" }}
                >
                  {cls}
                </Button>
              )
            )}
          </Box>

          {/* Apply Button */}
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
  );
};

export default TravellersClassSelector;
