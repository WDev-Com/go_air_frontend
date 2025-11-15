import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Navbar from "./component/Navbar";
import GoAirlineFooter from "./component/GoAirlineFooter";
import HomePage from "./pages/HomePage";
import FlightBookingPage from "./user_service/FlightBookingPage";
import FlightSearchResultPage from "./user_service/FlightSearchResultPage";
import ProtectedUser from "./auth/ProtectedUser";
import MyAccountPage from "./user_service/MyAccountPage ";
import BookingsPage from "./user_service/ViewBookingsPage";
import ViewTicketsPage from "./user_service/ViewTicketsPage";
import AboutPage from "./pages/AboutPage";
import AdminFlightsPage from "./admin_service/AdminFlightsPage";
import ProtectedAdmin from "./auth/ProtectedAdmin";
import NotFoundPage from "./pages/NotFoundPage";
import FlightEditPage from "./admin_service/FlightEditPage";
import CreateFlightPage from "./admin_service/CreateFlightPage";
import AllBookingsPage from "./admin_service/AllBookingsPage";
import { useDispatch } from "react-redux";
import { loadUserFromStorage } from "./auth/authSlice";
import { fetchUserByUsername } from "./user_service/userSlice";
import SuccessPage from "./user_service/SuccessPage";

// Layout component that wraps Navbar + Outlet + Footer
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
    element: <Layout />, //  Navbar + Footer inside this layout
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/success",
        element: <SuccessPage />,
      },

      { path: "/flight-search-results", element: <FlightSearchResultPage /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
      {
        path: "/admin/all-bookings",
        element: (
          <ProtectedAdmin>
            <AllBookingsPage />
          </ProtectedAdmin>
        ),
      },
      {
        path: "/admin/dashboard",
        element: (
          <ProtectedAdmin>
            <AdminFlightsPage />
          </ProtectedAdmin>
        ),
      },
      {
        path: "/admin/create-flights",
        element: (
          <ProtectedAdmin>
            <CreateFlightPage />
          </ProtectedAdmin>
        ),
      },

      {
        path: "/admin/edit-flight/:flightNumber",
        element: (
          <ProtectedAdmin>
            <FlightEditPage />
          </ProtectedAdmin>
        ),
      },
      {
        path: "/complete-booking",
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
        element: <MyAccountPage />,
      },

      {
        path: "/about",
        element: <AboutPage />,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromStorage());
    if (localStorage.getItem("user")) {
      dispatch(fetchUserByUsername(localStorage.getItem("user")));
    }
  }, [dispatch]);
  return <RouterProvider router={router} />;
}

export default App;
