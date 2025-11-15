import React, { useEffect } from "react";
import { Container, Box, Typography } from "@mui/material";
import FlightSearchMainPage from "../user_service/FlightSearchMainPage";
import { Navigate, useNavigate } from "react-router-dom";

const HomePage = () => {
  let navigate = useNavigate();
  useEffect(() => {
    // console.log(localStorage.getItem("role"));
    if (localStorage.getItem("role") == "ADMIN") {
      navigate("/admin/dashboard");
    }
  }, []);

  return (
    <>
      <FlightSearchMainPage />
    </>
  );
};

export default HomePage;
