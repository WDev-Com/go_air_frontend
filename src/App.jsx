import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Navbar from "./component/Navbar";
import GoAirlineFooter from "./component/GoAirlineFooter";
import HomePage from "./pages/HomePage";
import FlightSearchPage from "./user_service/FlightSearchPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/flight-search-results",
    element: <FlightSearchPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
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
