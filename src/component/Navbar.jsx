import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
  Collapse,
  Paper,
  Menu,
  MenuItem,
  ClickAwayListener, // 👈 import added
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const pages = [
  { name: "Home", path: "/" },
  {
    name: "Flights",
    subMenu: ["Search Flights", "Flight Status", "Special Offers"],
  },
  {
    name: "Bookings",
    subMenu: ["My Bookings", "Manage Booking", "Cancel Ticket"],
  },
  { name: "Check-in", path: "/checkin" },
  { name: "About", path: "/about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // For avatar menu

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleDropdown = (index) =>
    setActiveDropdown(activeDropdown === index ? null : index);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClickAway = () => {
    // 👇 Close menu when user clicks outside
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* ===== Top Navbar ===== */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#004aad", zIndex: 1300 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FlightTakeoffIcon
              sx={{ mr: 1, display: { xs: "none", md: "flex" } }}
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              GoAirline
            </Typography>

            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              onClick={toggleMobileMenu}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile Logo */}
            <Typography
              variant="h6"
              sx={{
                fontFamily: "monospace",
                fontWeight: 700,
                ml: 1,
                letterSpacing: ".1rem",
                display: { xs: "flex", md: "none" },
              }}
            >
              GoAirline
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {pages.map((page) => (
              <Button key={page.name} sx={{ color: "white" }}>
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Avatar */}
          <Box>
            <IconButton onClick={handleAvatarClick}>
              <Avatar alt="User" src="/static/images/avatar/2.jpg" />
            </IconButton>

            {/* ===== User Menu ===== */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ===== Relative Dropdown Menu (Mobile Only) ===== */}
      {mobileMenuOpen && (
        <ClickAwayListener onClickAway={handleClickAway}>
          <Paper
            elevation={6}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1200,
              backgroundColor: "#f0f4ff",
              display: { xs: "block", md: "none" },
            }}
          >
            {pages.map((page, i) => (
              <Box key={page.name}>
                {/* Parent Item */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#e0eaff" },
                  }}
                  onClick={() =>
                    page.subMenu ? toggleDropdown(i) : setMobileMenuOpen(false)
                  }
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {page.name}
                  </Typography>
                  {page.subMenu && (
                    <ExpandMoreIcon
                      sx={{
                        transform:
                          activeDropdown === i
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "0.3s",
                      }}
                    />
                  )}
                </Box>

                {/* Dropdown Items */}
                {page.subMenu && (
                  <Collapse
                    in={activeDropdown === i}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ pl: 4, pb: 1 }}>
                      {page.subMenu.map((sub, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{
                            py: 0.8,
                            cursor: "pointer",
                            "&:hover": { color: "#004aad", fontWeight: 600 },
                          }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {sub}
                        </Typography>
                      ))}
                    </Box>
                  </Collapse>
                )}
              </Box>
            ))}
          </Paper>
        </ClickAwayListener>
      )}
    </Box>
  );
}
