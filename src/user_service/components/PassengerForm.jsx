import React from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

const genders = ["SELECT GENDER", "MALE", "FEMALE", "OTHER"];

const PassengerForm = ({
  passengers,
  onAddPassenger,
  onRemovePassenger,
  onPassengerChange,
  filledInfoCount,
}) => {
  // console.log("Filled Info Count:", filledInfoCount);
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6">Passengers</Typography>
            <Typography variant="subtitle2" color="text.secondary">
              {filledInfoCount}/{passengers.length} info added
            </Typography>
          </Box>

          {passengers.map((p, i) => (
            <React.Fragment key={i}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  mb: 1,
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Passenger {i + 1}
                </Typography>
                {passengers.length > 1 && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onRemovePassenger(i)}
                  >
                    Remove
                  </Button>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={p.name}
                    onChange={(e) =>
                      onPassengerChange(i, "name", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={p.age}
                    onChange={(e) =>
                      onPassengerChange(i, "age", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    select
                    fullWidth
                    label="Gender"
                    value={p.gender || "SELECT GENDER"}
                    onChange={(e) =>
                      onPassengerChange(i, "gender", e.target.value)
                    }
                  >
                    {genders.map((g) => (
                      <MenuItem key={g} value={g}>
                        {g}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Passport No."
                    value={p.passportNumber}
                    onChange={(e) =>
                      onPassengerChange(i, "passportNumber", e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={2}>
                  <TextField
                    fullWidth
                    label="Seat No."
                    value={p.seatNo || ""}
                    disabled
                  />
                </Grid>
              </Grid>

              {i < passengers.length - 1 && <Divider sx={{ my: 2 }} />}
            </React.Fragment>
          ))}

          <Button sx={{ mt: 2 }} onClick={onAddPassenger}>
            + Add Passenger
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PassengerForm;
