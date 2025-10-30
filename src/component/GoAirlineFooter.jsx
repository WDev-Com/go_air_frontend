import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export default function GoAirlineFooter() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#004aad",
        color: "white",
        pt: 4,
        pb: 2,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* ===== Logo and About ===== */}
          <Grid item xs={12} md={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <FlightTakeoffIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={700}>
                GoAirline
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#d0e0ff" }}>
              Fly smarter with GoAirline — your trusted partner for comfort,
              safety, and affordable travel.
            </Typography>
          </Grid>

          {/* ===== Quick Links ===== */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontSize="1rem" mb={1}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
              {["Home", "Flights", "Bookings", "Check-in", "About"].map(
                (link) => (
                  <Link
                    key={link}
                    href="#"
                    color="inherit"
                    underline="hover"
                    sx={{
                      "&:hover": { color: "#cce0ff" },
                      fontSize: "0.9rem",
                    }}
                  >
                    {link}
                  </Link>
                )
              )}
            </Box>
          </Grid>

          {/* ===== Customer Support ===== */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" fontSize="1rem" mb={1}>
              Customer Support
            </Typography>
            <Typography variant="body2">📞 +91 98765 43210</Typography>
            <Typography variant="body2">✉️ support@goairline.com</Typography>
            <Typography variant="body2">🕒 24/7 Helpline</Typography>
          </Grid>

          {/* ===== Social Media ===== */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontSize="1rem" mb={1}>
              Follow Us
            </Typography>
            <Box>
              <IconButton color="inherit" href="#" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" href="#" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" href="#" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)", my: 2 }} />

        {/* ===== Bottom Bar ===== */}
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#cce0ff", fontSize: "0.85rem" }}
        >
          © {new Date().getFullYear()} GoAirline. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
