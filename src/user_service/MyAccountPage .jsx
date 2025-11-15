import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";
import {
  fetchUserByUsername,
  selectUserDetails,
  selectLoading,
  updateUser,
} from "./userSlice";
import { selectUser } from "../auth/authSlice";

const MyAccountPage = () => {
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetails);
  const loading = useSelector(selectLoading);
  const username = useSelector(selectUser);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
  });

  useEffect(() => {
    dispatch(fetchUserByUsername(username));
  }, []);
  // console.log(userDetails);
  useEffect(() => {
    if (username && !userDetails) {
      dispatch(fetchUserByUsername(username));
    } else if (userDetails) {
      setFormData({
        name: userDetails.name || "",
        email: userDetails.email || "",
        contact: userDetails.contact || "",
        address: userDetails.address || "",
      });
    }
  }, [dispatch, username, userDetails]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    dispatch(updateUser({ username, updatedData: formData })).then(() => {
      setIsEditing(false);
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6">No user data found. Please log in.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: "#64b5f6", fontSize: 32 }}
            >
              {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {formData.name || "Unknown User"}
              </Typography>
              <Typography color="text.secondary">@{username}</Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />
            </>
          ) : (
            <>
              <Typography variant="body1">
                <strong>Email:</strong> {formData.email || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Phone:</strong> {formData.contact || "N/A"}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {formData.address || "N/A"}
              </Typography>
            </>
          )}

          <Divider sx={{ my: 2 }} />

          {isEditing ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#64b5f6",
                  "&:hover": { backgroundColor: "#42a5f5" },
                  borderRadius: 2,
                  px: 4,
                }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#64b5f6",
                "&:hover": { backgroundColor: "#42a5f5" },
                borderRadius: 2,
                px: 4,
              }}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MyAccountPage;
