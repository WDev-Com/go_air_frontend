import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FlightSummaryAccordion = ({
  expanded,
  handleChange,
  selectedFlights,
}) => {
  return (
    <Accordion
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
      sx={{ borderRadius: 2, mb: 1 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" fontWeight="bold">
          Selected Flight Details
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        {Object.values(selectedFlights || {}).map((flight, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              mb: 2,
              borderLeft: "4px solid #1976d2",
              borderRadius: 2,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <CardContent sx={{ pb: 2 }}>
              {/* === ROUTE INFORMATION === */}
              <Grid item xs={12} md={6}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {/* Source Airport */}
                  <Box textAlign="left">
                    <Typography fontWeight="600">
                      {flight.sourceAirport}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.departureTime}
                    </Typography>
                  </Box>

                  {/* Arrow */}
                  <Typography variant="h6" color="primary" sx={{ mx: 2 }}>
                    →
                  </Typography>

                  {/* Destination Airport */}
                  <Box textAlign="right">
                    <Typography fontWeight="600">
                      {flight.destinationAirport}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.arrivalTime}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Duration */}
              <Box
                sx={{
                  mt: 1,
                  backgroundColor: "#e3f2fd",
                  p: 0.6,
                  borderRadius: 1,
                  display: "inline-block",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ mx: 1 }}
                >
                  Duration: {flight.durationMinutes} mins
                </Typography>
              </Box>

              {/* Flight Date */}
              <Box
                sx={{
                  mt: 1,
                  mx: 1,
                  backgroundColor: "#e3f2fd",
                  p: 0.6,
                  borderRadius: 1,
                  display: "inline-block",
                }}
              >
                <Typography variant="body2" color="primary" fontWeight="bold">
                  {flight.departureDate}
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* === FLIGHT DETAILS === */}
              <Grid container alignItems="center" spacing={2}>
                {/* Airline + Flight Number */}
                <Grid item xs={12} md={3}>
                  <Typography fontWeight="bold" variant="body1">
                    {flight.airline || "Airline"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.flightNumber} • {flight.aircraftType || "Airbus"}
                  </Typography>
                </Grid>

                {/* Baggage Info */}
                <Grid item xs={12} md={3}>
                  <Typography variant="body2">
                    🧳 Cabin: <strong>7kg</strong>
                  </Typography>
                  <Typography variant="body2">
                    🧳 Check-in: <strong>15kg</strong>
                  </Typography>
                </Grid>
              </Grid>

              {/* === INFO BANNER === */}
              <Box
                sx={{
                  backgroundColor: "#f9fbff",
                  mt: 2,
                  p: 1,
                  borderRadius: 1.5,
                  border: "1px dashed #90caf9",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontStyle: "italic" }}
                >
                  Got excess baggage? You can buy additional check-in allowance
                  for {flight.sourceAirport} → {flight.destinationAirport}.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default FlightSummaryAccordion;
