const BASE_URL = "http://localhost:8080/admin";

// ✅ Unified API request helper with proper error handling
export const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
    });

    // ✅ Try parsing JSON once
    let data;
    try {
      data = await response.json();
    } catch {
      data = null; // in case response has no JSON
    }
    // console.log("API Response Data:", data);
    // ✅ Log response safely
    // console.log("API Response:", data);

    // ✅ Handle non-OK responses
    if (!response.ok) {
      const message =
        data?.message || data || `Request failed: ${response.status}`;
      throw new Error(message);
    }

    // ✅ Return data or plain text
    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

// ===============================
// ✈️ FLIGHTS API FUNCTIONS
// ===============================
export const fetchAllFlightsAPI = async (filters = {}) => {
  try {
    console.log("Fetching flights with filters:", filters);

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
    console.log("Constructed Endpoint:", endpoint);
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

// ===============================
// 💺 SEATS API FUNCTIONS
// ===============================
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
