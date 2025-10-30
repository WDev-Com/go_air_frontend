import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchFlights, selectFlights, selectLoading } from "./userSlice";
import FilterSidebar from "./FilterSidebar";
import FlightResults from "./FlightResults";
import {
  Box,
  CircularProgress,
  Divider,
  Typography,
  Grid,
} from "@mui/material";
import EditableSummaryBar from "./components/EditableSummaryBar";

const FlightSearchPage = () => {
  const dispatch = useDispatch();
  const flights = useSelector(selectFlights);
  const loading = useSelector(selectLoading);
  const isFirstLoad = useRef(true);
  const location = useLocation();

  // ✅ Get search params from navigation
  const formData = location.state?.searchParams || {};

  // ✅ Initial filters state
  const [filters, setFilters] = useState({
    tripType: "ONE_WAY",
    sourceAirports: "",
    destinationAirports: "",
    departureDates: "",
    returnDate: "",
    stop: null,
    minPrice: 3000,
    maxPrice: 30000,
    airlines: [],
    departureType: null,
    aircraftSize: null,
    specialFareType: "REGULAR",
    passengers: 1,
    travelClass: "Economy/Premium Economy",
    travellers: {
      adults: 1,
      children: 0,
      infants: 0,
      travelClass: "Economy/Premium Economy",
    },
  });

  // ✅ Merge incoming form data
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      const { travellers = {}, ...rest } = formData;
      const totalPassengers =
        (travellers.adults || 0) +
        (travellers.children || 0) +
        (travellers.infants || 0);

      setFilters((prev) => ({
        ...prev,
        ...rest,
        passengers: totalPassengers,
        travelClass: travellers.travelClass || prev.travelClass,
        travellers: {
          adults: travellers.adults || prev.travellers.adults,
          children: travellers.children || prev.travellers.children,
          infants: travellers.infants || prev.travellers.infants,
          travelClass: travellers.travelClass || prev.travellers.travelClass,
        },
      }));
    }
  }, [formData]);

  // ✅ Fetch flights API
  const handleSearch = async (params = filters) => {
    if (!params.sourceAirports || !params.destinationAirports) {
      console.warn("❌ Missing required parameters. Skipping API call.");
      return;
    }

    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== null && value !== "" && value !== undefined
      )
    );

    console.log("🚀 Searching flights with:", cleanParams);
    try {
      await dispatch(fetchFlights(cleanParams)).unwrap();
    } catch (error) {
      console.error("❌ Error fetching flights:", error);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      handleSearch(filters);
    }
  }, []);

  // ✅ Re-fetch on filter updates
  useEffect(() => {
    if (!isFirstLoad.current) {
      handleSearch(filters);
    }
  }, [filters]);

  // ✅ Handle filter updates
  const handleFiltersChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  return (
    <>
      <EditableSummaryBar values={filters} onApply={handleFiltersChange} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          minHeight: "100vh",
          bgcolor: "#f3f6f9",
          gap: 2,
          px: 3,
          py: 2,
        }}
      >
        {/* Sidebar */}
        <FilterSidebar
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Main Content */}
        <Box sx={{ flex: 1, position: "relative" }}>
          <Divider sx={{ mb: 2 }} />

          {/* ✅ Results Section */}
          <Box sx={{ mt: 2, pb: 5 }}>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "60vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : flights && Object.keys(flights).length > 0 ? (
              <FlightResults flights={flights} />
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center", mt: 4 }}
              >
                No flights found. Try changing filters.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FlightSearchPage;
