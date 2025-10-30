import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";

const FlightResults = ({ flights, loading }) => {
  if (loading) return <Typography>Loading...</Typography>;
  if (!flights || Object.keys(flights).length === 0)
    return <Typography>No flights found</Typography>;

  return (
    <Box sx={{ flex: 1, p: 2 }}>
      {Object.entries(flights).map(([route, routeFlights]) => (
        <Box key={route}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {route}
          </Typography>
          {routeFlights.map((flight) => (
            <Card key={flight.id} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h6">{flight.airline}</Typography>
                    <Typography variant="body2">
                      {flight.flightNumber}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h5">{flight.departureTime}</Typography>
                    <Typography variant="body2">
                      {flight.sourceAirport}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="body2">{flight.duration}</Typography>
                    <Typography variant="caption">
                      {flight.stop === 0 ? "Non Stop" : `${flight.stop} Stop`}
                    </Typography>
                  </Box>
                  <Box textAlign="center">
                    <Typography variant="h5">{flight.arrivalTime}</Typography>
                    <Typography variant="body2">
                      {flight.destinationAirport}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="h6">₹{flight.price}</Typography>
                    <Button variant="contained" size="small">
                      View Prices
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
          <Divider sx={{ my: 3 }} />
        </Box>
      ))}
    </Box>
  );
};

export default FlightResults;
