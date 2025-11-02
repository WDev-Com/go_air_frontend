import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Navbar from "./component/Navbar";
import GoAirlineFooter from "./component/GoAirlineFooter";
import HomePage from "./pages/HomePage";
import FlightBookingPage from "./user_service/FlightBookingPage";
import BookingCompleted from "./user_service/components/BookingCompleted";
import FlightSearchResultPage from "./user_service/FlightSearchResultPage";
import ProtectedUser from "./auth/ProtectedUser";
import MyAccountPage from "./user_service/MyAccountPage ";
import BookingsPage from "./user_service/ViewBookingsPage";
import ViewTicketsPage from "./user_service/ViewTicketsPage";

// ✅ Layout component that wraps Navbar + Outlet + Footer
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* child routes render here */}
      <GoAirlineFooter />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />, // ✅ Navbar + Footer inside this layout
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/flight-search-results", element: <FlightSearchResultPage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/book/:flightNumber",
        element: (
          <ProtectedUser>
            <FlightBookingPage />
          </ProtectedUser>
        ),
      },
      {
        path: "/bookings",
        element: (
          <ProtectedUser>
            <BookingsPage />
          </ProtectedUser>
        ),
      },
      {
        path: "/tickets/:bookingId",
        element: (
          <ProtectedUser>
            <ViewTicketsPage />
          </ProtectedUser>
        ),
      },
      {
        path: "/my-account",
        element: (
          <ProtectedUser>
            <MyAccountPage />
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
      { path: "*", element: <HomePage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
