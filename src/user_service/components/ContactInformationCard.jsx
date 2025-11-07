import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

const ContactInformationCard = ({
  booking,
  setBooking,
  currentIndex = 0,
  tripType = "ONE_WAY",
}) => {
  const [localContact, setLocalContact] = useState({
    contactEmail: "",
    contactPhone: "",
    specialFareType: "REGULAR",
  });

  useEffect(() => {
    if (booking) {
      setLocalContact({
        contactEmail: booking.contactEmail || "",
        contactPhone: booking.contactPhone || "",
        specialFareType: booking.specialFareType || "REGULAR",
      });
    }
  }, [booking]);

  const handleChange = (field, value) => {
    const updatedContact = { ...localContact, [field]: value };
    setLocalContact(updatedContact);

    // ✅ Safely update contact info in parent
    setBooking((prev) => {
      // Ensure prev is always an array
      if (!Array.isArray(prev)) {
        console.warn(
          "ContactInformationCard: Expected bookings array, got:",
          prev
        );
        return prev; // prevent crash
      }

      const updatedBookings = [...prev];
      const bookingToUpdate =
        tripType === "ONE_WAY"
          ? { ...updatedBookings[0], [field]: value }
          : { ...updatedBookings[currentIndex], [field]: value };

      if (tripType === "ONE_WAY") updatedBookings[0] = bookingToUpdate;
      else updatedBookings[currentIndex] = bookingToUpdate;

      return updatedBookings;
    });
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6">Contact Information</Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              label="Email"
              fullWidth
              value={localContact.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Phone"
              fullWidth
              value={localContact.contactPhone}
              onChange={(e) => handleChange("contactPhone", e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Special Fare Type"
              value={localContact.specialFareType || "REGULAR"}
              onChange={(e) => handleChange("specialFareType", e.target.value)}
            >
              <MenuItem value="REGULAR">None</MenuItem>
              <MenuItem value="ARMED_FORCES">Armed Forces</MenuItem>
              <MenuItem value="STUDENT">Student</MenuItem>
              <MenuItem value="SENIOR_CITIZEN">Senior Citizen</MenuItem>
              <MenuItem value="DOCTOR_AND_NURSES">Doctor & Nurses</MenuItem>
              <MenuItem value="FAMILY">Family</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ContactInformationCard;
