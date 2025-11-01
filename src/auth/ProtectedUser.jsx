import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser } from "./authSlice";

const ProtectedUser = ({ children }) => {
  const user = useSelector(selectUser);

  // if user not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedUser;
