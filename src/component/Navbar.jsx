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
  ClickAwayListener,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";
import { selectUser } from "../auth/authSlice"; // ✅ import selector
import { Link, useNavigate } from "react-router-dom"; // ✅ for navigation

const pages = [
  { name: "Home", path: "/" },
  {
    name: "Bookings",
    path: "/bookings",
  },
  { name: "About", path: "/about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const user = useSelector(selectUser);
  const navigate = useNavigate();

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
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  return (
    <Box sx={{ position: "relative" }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#004aad", zIndex: 1300 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* ===== Left Section ===== */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FlightTakeoffIcon
              sx={{ mr: 1, display: { xs: "none", md: "flex" } }}
            />
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                  color: "inherit",
                }}
              >
                GoAirline
              </Typography>
            </Link>

            {/* ===== Mobile Menu Icon ===== */}
            <IconButton
              color="inherit"
              onClick={toggleMobileMenu}
              sx={{ display: { xs: "flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

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

          {/* ===== Desktop Menu ===== */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {pages.map((page, index) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* ===== Right Section ===== */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                <IconButton onClick={handleAvatarClick}>
                  <Avatar
                    alt={user?.name || "User"}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>

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
                  <MenuItem
                    onClick={() => {
                      navigate("/my-account");
                      handleMenuClose();
                    }}
                  >
                    My Account
                  </MenuItem>

                  {/* ✅ New “View Tickets” Button */}
                  <MenuItem
                    onClick={() => {
                      navigate(`/bookings`);
                      handleMenuClose();
                    }}
                  >
                    View Booking
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      // your logout logic here
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                  sx={{ fontWeight: 600 }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/signup")}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "#42a5f5",
                    "&:hover": { backgroundColor: "#108ff7ff" },
                    color: "white",
                  }}
                >
                  Signup
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* ===== Mobile Dropdown Menu ===== */}
      {mobileMenuOpen && (
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
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
              {pages.map((page, i) => (
                <Box key={page.name}>
                  <Box
                    component={Link}
                    to={page.path}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                      py: 1.5,
                      cursor: "pointer",
                      color: "inherit", // ✅ keeps text color consistent
                      textDecoration: "none", // ✅ removes underline
                      "&:hover": {
                        backgroundColor: "#e0eaff",
                        textDecoration: "none", // ✅ ensures hover doesn’t re-add underline
                      },
                    }}
                    onClick={() =>
                      page.subMenu
                        ? toggleDropdown(i)
                        : setMobileMenuOpen(false)
                    }
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {page.name}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </ClickAwayListener>
        </Paper>
      )}
    </Box>
  );
}
