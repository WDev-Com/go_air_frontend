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
import { useNavigate, useLocation } from "react-router-dom";

const FlightResults = ({ flights, loading, filters }) => {
  const routeKeys = Object.keys(flights || {});
  // console.log(flights);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedFlights, setSelectedFlights] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Recover selected flights if user came back from passenger/seat page
  useEffect(() => {
    if (
      location.state?.from === "booking-page" &&
      location.state?.selectedFlights
    ) {
      setSelectedFlights(location.state.selectedFlights);
    }
  }, [location.state]);

  // ✅ Auto-select first route
  useEffect(() => {
    if (routeKeys.length > 0) setSelectedRoute(routeKeys[0]);
  }, [flights]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!flights || routeKeys.length === 0)
    return <Typography>No flights found</Typography>;

  // ✅ Determine routes to show
  let availableRoutes = [];
  if (filters?.tripType === "ONE_WAY") {
    availableRoutes = [routeKeys[0]];
  } else if (filters?.tripType === "ROUND_TRIP") {
    availableRoutes = routeKeys.slice(0, 2);
  } else {
    availableRoutes = routeKeys;
  }

  // ✅ Store selected flight per route
  const handleFlightSelect = (routeKey, flight) => {
    setSelectedFlights((prev) => ({
      ...prev,
      [routeKey]: flight,
    }));
  };

  // ✅ Move to next route
  const handleNextRoute = () => {
    const currentIndex = availableRoutes.indexOf(selectedRoute);
    if (currentIndex < availableRoutes.length - 1) {
      setTimeout(() => {
        setSelectedRoute(availableRoutes[currentIndex + 1]);
      }, 200);
    }
  };

  // ✅ Navigate to booking page
  const handleBookAll = () => {
    // check if all routes have selected flights
    const allSelected = availableRoutes.every(
      (route) => selectedFlights[route]
    );
    if (!allSelected) {
      alert("Please select a flight for all routes before booking.");
      return;
    }

    // ✅ Pass selectedFlights as key–value pair (not array)
    navigate(`/complete-booking`, {
      state: {
        filtersData: filters,
        selectedFlights: selectedFlights, // <-- key–value pair
        from: "flight-results",
      },
    });
  };

  const flightsForSelectedRoute = flights[selectedRoute] || [];
  const allFlightsSelected =
    availableRoutes.length > 0 &&
    availableRoutes.every((r) => selectedFlights[r]);

  return (
    <Box sx={{ flex: 1, p: 2 }}>
      {/* === Route Selector === */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ToggleButtonGroup
          color="primary"
          exclusive
          value={selectedRoute}
          onChange={(e, newRoute) => {
            if (newRoute) setSelectedRoute(newRoute); // ✅ manual switch
          }}
          fullWidth
          sx={{
            maxWidth: 900,
            borderRadius: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            transition: "all 0.4s ease",
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
              transform: "scale(1.03)",
              boxShadow: "0 4px 10px rgba(0,120,255,0.3)",
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
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>

      {/* === Flight Cards === */}
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          transition: "opacity 0.4s ease, transform 0.3s ease",
        }}
      >
        {flightsForSelectedRoute.length > 0 ? (
          flightsForSelectedRoute.map((flight) => {
            const isSelected =
              selectedFlights[selectedRoute]?.flightNumber ===
              flight.flightNumber;
            return (
              <Card
                key={flight.id}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  p: 1,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  border: isSelected ? "2px solid #0078ff" : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.01)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {flight.airline}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {flight.flightNumber}
                      </Typography>
                    </Box>

                    <Box textAlign="center">
                      <Typography variant="h6">
                        {flight.departureTime}
                      </Typography>
                      <Typography variant="caption">
                        {flight.sourceAirport}
                      </Typography>
                    </Box>

                    <Box textAlign="center">
                      <Typography variant="body2">
                        {(flight.durationMinutes / 60).toFixed(0)}h{" "}
                        {flight.durationMinutes % 60}m
                      </Typography>
                      <Typography variant="caption">
                        {flight.stop === 0
                          ? "Non stop"
                          : `${flight.stop} stop${flight.stop > 1 ? "s" : ""}`}
                      </Typography>
                    </Box>

                    <Box textAlign="center">
                      <Typography variant="h6">{flight.arrivalTime}</Typography>
                      <Typography variant="caption">
                        {flight.destinationAirport}
                      </Typography>
                    </Box>

                    <Box textAlign="right">
                      <Typography variant="h6" color="primary">
                        ₹{flight.price.toLocaleString()}
                      </Typography>
                      <Button
                        variant={isSelected ? "contained" : "outlined"}
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() =>
                          handleFlightSelect(selectedRoute, flight)
                        }
                      >
                        {isSelected ? "Selected" : "Select"}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography>No flights available for this route.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* === Navigation Buttons === */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        {!allFlightsSelected ? (
          selectedFlights[selectedRoute] && (
            <Button
              variant="contained"
              color="primary"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={handleNextRoute}
            >
              Next
            </Button>
          )
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              transition: "all 0.3s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
            onClick={handleBookAll}
          >
            Book {availableRoutes.length} Selected Flight
            {availableRoutes.length > 1 ? "s" : ""}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FlightResults;
