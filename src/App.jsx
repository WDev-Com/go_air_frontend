import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Navbar from "./component/Navbar";
import GoAirlineFooter from "./component/GoAirlineFooter";
import HomePage from "./pages/HomePage";
import FlightBookingPage from "./user_service/FlightBookingPage";
import BookingCompleted from "./user_service/components/BookingCompleted";
import FlightSearchResultPage from "./user_service/FlightSearchResultPage";
import ProtectedUser from "./auth/ProtectedUser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // Public
  },
  {
    path: "/flight-search-results",
    element: <FlightSearchResultPage />, // Public
  },
  {
    path: "/login",
    element: <Login />, // Public
  },
  {
    path: "/signup",
    element: <Signup />, // Public
  },
  {
    path: "/book/:flightNumber",
    element: (
      <ProtectedUser>
        <FlightBookingPage />
      </ProtectedUser>
    ),
  },
  {
    path: "/booking-completed",
    element: (
      <ProtectedUser>
        <BookingCompleted />
      </ProtectedUser>
    ),
  },
  {
    path: "*",
    element: <HomePage />,
  },
]);

function App() {
  return (
    <div className="App">
      <Navbar />
      <RouterProvider router={router} />
      <GoAirlineFooter />
    </div>
  );
}

export default App;
