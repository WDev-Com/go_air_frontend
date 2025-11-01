import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FlightResults = ({ flights, loading, filters }) => {
  const routeKeys = Object.keys(flights || {});
  const [selectedRoute, setSelectedRoute] = useState("");
  const navigate = useNavigate();
  // ✅ Auto-select first route
  useEffect(() => {
    if (routeKeys.length > 0) setSelectedRoute(routeKeys[0]);
  }, [flights]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!flights || routeKeys.length === 0)
    return <Typography>No flights found</Typography>;

  // ✅ Trip type logic
  let availableRoutes = [];
  if (filters?.tripType === "ONE_WAY") {
    availableRoutes = [routeKeys[0]];
  } else if (filters?.tripType === "ROUND_TRIP") {
    availableRoutes = routeKeys.slice(0, 2);
  } else {
    availableRoutes = routeKeys;
  }

  const handleRouteChange = (event, newRoute) => {
    if (newRoute) setSelectedRoute(newRoute);
  };

  const selectedFlights = flights[selectedRoute] || [];

  return (
    <Box sx={{ flex: 1, p: 2 }}>
      {/* ✅ ToggleButtonGroup now full width like cards */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <ToggleButtonGroup
          color="primary"
          exclusive
          value={selectedRoute}
          onChange={handleRouteChange}
          fullWidth
          sx={{
            maxWidth: 900, // same visual width as flight cards
            borderRadius: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            "& .MuiToggleButton-root": {
              flex: 1,
              minWidth: 250,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              m: 0.5,
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "all 0.3s ease",
            },
            "& .Mui-selected": {
              backgroundColor: "#0078ff",
              color: "white",
              borderColor: "#0078ff",
              "&:hover": {
                backgroundColor: "#0062cc",
              },
            },
          }}
        >
          {availableRoutes.map((routeKey) => {
            const routeFlights = flights[routeKey];
            if (!routeFlights || routeFlights.length === 0) return null;

            const title = routeKey.replace("_", " → ");
            const first = routeFlights[0];

            return (
              <ToggleButton key={routeKey} value={routeKey}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {title}
                </Typography>
                <Typography variant="caption">{first.departureDate}</Typography>
                <Typography variant="caption">
                  {first.departureTime} → {first.arrivalTime}
                </Typography>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>

      {/* ✅ Flight Cards */}
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {selectedFlights.length > 0 ? (
          selectedFlights.map((flight) => (
            <Card
              key={flight.id}
              sx={{
                mb: 2,
                borderRadius: 2,
                p: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                >
                  {/* Airline Info */}
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {flight.airline}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {flight.flightNumber}
                    </Typography>
                  </Box>

                  {/* Departure */}
                  <Box textAlign="center">
                    <Typography variant="h6">{flight.departureTime}</Typography>
                    <Typography variant="caption">
                      {flight.sourceAirport}
                    </Typography>
                  </Box>

                  {/* Duration */}
                  <Box textAlign="center">
                    <Typography variant="body2">
                      {(flight.durationMinutes / 60).toFixed(0)}h{" "}
                      {flight.durationMinutes % 60}m
                    </Typography>
                    <Typography variant="caption">
                      {flight.stop === 0
                        ? "Non stop"
                        : `${flight.stop} stop${flight.stop > 1 ? "s" : ""}${
                            flight.destinationStop
                              ? ` via ${flight.destinationStop}`
                              : ""
                          }`}
                    </Typography>
                  </Box>

                  {/* Arrival */}
                  <Box textAlign="center">
                    <Typography variant="h6">{flight.arrivalTime}</Typography>
                    <Typography variant="caption">
                      {flight.destinationAirport}
                    </Typography>
                  </Box>

                  {/* Price */}
                  <Box textAlign="right">
                    <Typography variant="h6" color="primary">
                      ₹{flight.price.toLocaleString()}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() =>
                        navigate(`/book/${flight.flightNumber}`, {
                          state: { filtersData: filters },
                        })
                      }
                    >
                      Book Now
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography>No flights available for this route.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />
    </Box>
  );
};

export default FlightResults;
