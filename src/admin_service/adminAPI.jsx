import { toast } from "react-toastify";
import { extractMessage } from "../user_service/userAPI";

const BASE_URL = "http://localhost:8080/admin";

// Fetch bookings by filters
export const fetchAllBookingsAPI = async (filters = {}) => {
  const params = new URLSearchParams();
  const token = localStorage.getItem("jwtToken");

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const response = await fetch(
    `${BASE_URL}/bookings/search?${params.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  );

  if (!response.ok) {
    toast.error("Failed to fetch bookings");
  }

  return await response.json();
};

// Unified API request helper with proper error handling
export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const token = localStorage.getItem("jwtToken"); // 👈 get token from localStorage

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // attach token if available
      },

      body: body ? JSON.stringify(body) : null,
    });

    //  Determine response content type
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text(); // handle plain text messages
    }

    if (!response.ok) {
      // If backend sends plain text, ensure we throw properly
      throw new Error(
        typeof data === "string"
          ? data
          : extractMessage(data?.message) || "Unknown error"
      );
    }

    return data;
  } catch (error) {
    console.error("❌ API Error:", extractMessage(error.message));
    throw error;
  }
};

// ===============================
// ✈️ FLIGHTS API FUNCTIONS
// ===============================
export const fetchAllFlightsAPI = async (filters = {}) => {
  try {
    // console.log("Fetching flights with filters:", filters);

    // Convert filters object into query parameters
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value);
        }
      }
    });

    // Example: /searchByPaginationAndFilters?page=0&limit=5&airlines=Indigo
    const endpoint = `/searchByPaginationAndFilters?${queryParams.toString()}`;
    // console.log("Constructed Endpoint:", endpoint);
    return await apiRequest(endpoint, "GET"); // ✅ GET with params
  } catch (error) {
    console.error("❌ Error fetching all flights:", error.message);
    throw error;
  }
};

export const createFlightAPI = async (flight) => {
  try {
    return await apiRequest("/flights", "POST", flight);
  } catch (error) {
    console.error("❌ Error creating flight:", error.message);
    throw error;
  }
};

export const getFlightByNumberAPI = async (flightNumber) => {
  try {
    return await apiRequest(`/flights/${flightNumber}`, "GET");
  } catch (error) {
    console.error("❌ Error fetching flight by number:", error.message);
    throw error;
  }
};

export const updateFlightAPI = async (flightNumber, flight) => {
  try {
    return await apiRequest(`/flights/${flightNumber}`, "PUT", flight);
  } catch (error) {
    console.error("❌ Error updating flight:", error.message);
    throw error;
  }
};

export const deleteFlightAPI = async (flightNumber) => {
  try {
    return await apiRequest(`/flights/${flightNumber}`, "DELETE");
  } catch (error) {
    console.error("❌ Error deleting flight:", error.message);
    throw error;
  }
};

// SEATS API FUNCTIONS
export const generateSeatsAPI = async (flightNo) => {
  try {
    return await apiRequest(`/generate-seats/${flightNo}`, "POST");
  } catch (error) {
    console.error("❌ Error generating seats:", error.message);
    throw error;
  }
};

export const getSeatsByFlightNumberAPI = async (flightNumber) => {
  try {
    return await apiRequest(`/flight/seats/${flightNumber}`, "GET");
  } catch (error) {
    console.error("❌ Error fetching seats by flight number:", error.message);
    throw error;
  }
};
