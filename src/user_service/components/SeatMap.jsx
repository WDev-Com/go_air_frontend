import React, { useRef, useEffect, useState } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import planeFront from "../../assets/plane_front.png";
import planeTail from "../../assets/plane_tail.png";

const SeatMap = ({
  seats = [],
  selectedSeats = [],
  onSeatSelect,
  aircraftSize = "MEDIUM",
}) => {
  const seatContainerRef = useRef(null);
  const [seatMapWidth, setSeatMapWidth] = useState(500);

  const imageHeights = {
    LIGHT: 100,
    MEDIUM: 200,
    LARGE: 250,
    JUMBO: 325,
  };

  useEffect(() => {
    if (seatContainerRef.current) {
      // fallback when scrollWidth is 0
      const width = seatContainerRef.current.scrollWidth || 500;
      setSeatMapWidth(width * 1.4);
    }
  }, [seats, aircraftSize]);

  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.rowNumber;
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(groupedSeats).sort(
    (a, b) => Number(a) - Number(b)
  );

  // ensure selectedSeats are strings for comparisons
  const normalizedSelected = selectedSeats.map((s) =>
    s == null ? "" : String(s)
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "#d9ecff",
        p: 2,
        borderRadius: 3,
        width: "100%",
      }}
    >
      <Box
        component="img"
        src={planeFront}
        alt="Airplane Front"
        sx={{
          width: `${seatMapWidth}px`,
          height: `${imageHeights[aircraftSize]}px`,
          mb: -1,
          objectFit: "fill",
        }}
      />

      <Box
        ref={seatContainerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          mt: -2,
          py: 1,
          px: 1,
          borderRadius: "0 0 35px 35px",
          overflowX: "auto",
          minWidth: "fit-content",
        }}
      >
        {sortedRows.map((rowNumber) => {
          const rowSeats = groupedSeats[rowNumber].sort((a, b) =>
            a.columnLabel.localeCompare(b.columnLabel)
          );
          const layout = formatRowLayout(rowSeats, aircraftSize);

          return (
            <Box
              key={rowNumber}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.2,
                minWidth: "max-content",
              }}
            >
              {layout.map((group, idx) => (
                <React.Fragment key={idx}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {group.map((seat) =>
                      renderSeatButton(seat, normalizedSelected, onSeatSelect)
                    )}
                  </Box>

                  {idx < layout.length - 1 && (
                    <Typography
                      variant="caption"
                      sx={{
                        width: 30,
                        color: "gray",
                        fontWeight: "bold",
                        textAlign: "center",
                        mx: 2.5,
                      }}
                    >
                      {rowNumber}
                    </Typography>
                  )}
                </React.Fragment>
              ))}
            </Box>
          );
        })}
      </Box>

      <Box
        component="img"
        src={planeTail}
        alt="Airplane Tail"
        sx={{
          width: `${seatMapWidth * 1.05}px`,
          height: `${imageHeights[aircraftSize]}px`,
          mt: 0.2,
          objectFit: "fill",
        }}
      />

      <Divider sx={{ my: 2, width: "100%" }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Legend color="#e0e0e0" label="Available" />
        <Legend color="#1976d2" label="Selected" />
        <Legend color="#d32f2f" label="Occupied" />
      </Box>
    </Box>
  );
};

const formatRowLayout = (seats, aircraftSize) => {
  const sorted = [...seats].sort((a, b) =>
    a.columnLabel.localeCompare(b.columnLabel)
  );

  switch (aircraftSize) {
    case "LIGHT":
      return [sorted.slice(0, 2), sorted.slice(2, 4)];
    case "MEDIUM":
      return [sorted.slice(0, 3), sorted.slice(3, 6)];
    case "LARGE":
      return [sorted.slice(0, 2), sorted.slice(2, 6), sorted.slice(6, 8)];
    case "JUMBO":
      return [sorted.slice(0, 3), sorted.slice(3, 7), sorted.slice(7, 10)];
    default:
      return [sorted];
  }
};

const renderSeatButton = (seat, selectedSeats, onSeatSelect) => {
  const seatNumberStr = seat.seatNumber == null ? "" : String(seat.seatNumber);
  const isOccupied = seat.seatStatus === "OCCUPIED";
  const isSelected = selectedSeats.includes(seatNumberStr);

  return (
    <Button
      key={seat.id ?? seatNumberStr}
      onClick={() => !isOccupied && onSeatSelect(seatNumberStr)}
      disabled={isOccupied}
      variant="contained"
      sx={{
        width: 22,
        height: 22,
        minWidth: 0,
        p: 0,
        borderRadius: "5px",
        fontSize: "0.65rem",
        bgcolor: isOccupied ? "#d32f2f" : isSelected ? "#1976d2" : "#e0e0e0",
        color: isOccupied ? "white" : isSelected ? "white" : "black",
        "&:hover": {
          bgcolor: isOccupied ? "#d32f2f" : "#1565c0",
          color: "white",
        },
      }}
    >
      {seat.columnLabel}
    </Button>
  );
};

const Legend = ({ color, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <Box sx={{ width: 14, height: 14, bgcolor: color, borderRadius: "3px" }} />
    <Typography variant="caption">{label}</Typography>
  </Box>
);

export default SeatMap;
