import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signupUserAsync,
  checkUsernameAvailabilityAsync,
  selectAuthStatus,
} from "./authSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const usernameAvailable = useSelector(
    (state) => state.auth.usernameAvailable
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (username.trim().length > 2) {
      const delayDebounce = setTimeout(() => {
        dispatch(checkUsernameAvailabilityAsync(username));
      }, 500); // debounce 0.5s

      return () => clearTimeout(delayDebounce);
    }
  }, [username, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning("Please enter all fields");
      return;
    }

    if (usernameAvailable === false) {
      toast.error("Username is already taken");
      return;
    }

    dispatch(signupUserAsync({ username, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/login");
      }
    });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1976d2 0%, #90caf9 100%)",
      }}
    >
      <Paper sx={{ mx: 2, padding: 4, width: 400, borderRadius: 3 }}>
        <Typography
          variant="h5"
          textAlign="center"
          color="primary"
          gutterBottom
        >
          Create Account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {username &&
                    (usernameAvailable === true ? (
                      <CheckCircle color="success" />
                    ) : usernameAvailable === false ? (
                      <Cancel color="error" />
                    ) : null)}
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
            disabled={status === "loading"}
          >
            {status === "loading" ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>

          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link component="button" onClick={() => navigate("/login")}>
              Login here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
