import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const AboutPage = () => {
  const navigate = useNavigate();
  const sections = [
    {
      title: "✈️ Our Mission",
      text: "To provide efficient, reliable, and sustainable air travel that connects people and enhances the travel experience through innovation and excellence.",
    },
    {
      title: "🌍 Our Vision",
      text: "To be India's most admired airline — known for punctuality, comfort, customer satisfaction, and eco-conscious operations.",
    },
    {
      title: "💼 Our Values",
      text: "Safety, transparency, innovation, and integrity guide every decision at GO Air — ensuring we fly with purpose and passion.",
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        maxWidth: "1200px",
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 4, color: "#0B3D91" }}
      >
        About GO Air
      </Typography>

      {/* Mission, Vision, Values */}
      <Grid container spacing={3} justifyContent="center">
        {sections.map((section, index) => (
          <Grid item xs={12} sm={10} md={8} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    mb: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {section.text}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Divider */}
      <Divider sx={{ my: 5 }} />

      {/* Stats Section */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#0B3D91" }}
          >
            150+
          </Typography>
          <Typography variant="body2">Daily Flights</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#0B3D91" }}
          >
            50+
          </Typography>
          <Typography variant="body2">Destinations</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "#0B3D91" }}
          >
            25M+
          </Typography>
          <Typography variant="body2">Happy Passengers</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 5 }} />

      {/* CTA Section */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Fly with GO Air — Your Journey, Our Priority
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: "600px", mx: "auto", mb: 3 }}
        >
          Experience the next level of comfort, affordability, and on-time
          performance. Start your journey today!
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/");
          }}
          sx={{
            backgroundColor: "#0B3D91",
            borderRadius: 5,
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          Book a Flight
        </Button>
      </Box>
    </Box>
  );
};

export default AboutPage;
