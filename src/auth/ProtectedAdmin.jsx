import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUserRole } from "../auth/authSlice";

const ProtectedAdmin = ({ children }) => {
  const role = useSelector(selectUserRole);

  // If not logged in or not an ADMIN → redirect to login
  if (role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedAdmin;
