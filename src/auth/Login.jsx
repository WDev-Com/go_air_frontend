import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUserAsync, selectAuthStatus } from "./authSlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const status = useSelector(selectAuthStatus);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning("Please enter all fields");
      return;
    }
    dispatch(loginUserAsync({ username, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/home"); // redirect after login (adjust path as needed)
      }
    });
  };

  return (
    <>
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
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              sx={{ mt: 1 }}
              disabled={status === "loading"}
            >
              {status === "loading" ? <CircularProgress size={24} /> : "Login"}
            </Button>

            <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
              Don't have an account?{" "}
              <Link component="button" onClick={() => navigate("/signup")}>
                Sign up here
              </Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </>
  );
}
