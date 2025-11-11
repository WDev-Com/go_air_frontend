import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8080";
const token = localStorage.getItem("jwtToken"); // 👈 get token from localStorage

// ===============================
// ✈️ Search Flights
// ===============================
export const searchFlightsAPI = async (params) => {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  const queryParams = new URLSearchParams();
  Object.entries(filteredParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => queryParams.append(key, v));
    } else {
      queryParams.append(key, value);
    }
  });

  const url = `${BASE_URL}/user/flights/search?${queryParams.toString()}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ Bearer token
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `HTTP ${response.status}: Failed to fetch flights`
      );
    }

    return data;
  } catch (error) {
    console.error("❌ searchFlightsAPI Error:", error.message);
    throw error;
  }
};

// ===============================
// 👤 Get user by username
// ===============================
export const getUserByUsernameAPI = async (username) => {
  try {
    const res = await fetch(`${BASE_URL}/user/username/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ Bearer token
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch user details: ${errorText || res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("❌ getUserByUsernameAPI:", error);
    throw new Error("Unable to retrieve user details.");
  }
};

// ===============================
// ✈️ Get flight by flight number
// ===============================
export const getFlightByNumberAPI = async (flightNumber) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/flights/${flightNumber}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch flight details: ${errorText || res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    console.error("❌ getFlightByNumberAPI:", error);
    throw new Error("Unable to retrieve flight details.");
  }
};

// ===============================
// 🧾 Book flight
// ===============================
export const bookFlightAPI = async (userID, bookingData) => {
  try {
    const res = await fetch(`${BASE_URL}/user/book/${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(bookingData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Booking failed: ${errorText || res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ bookFlightAPI:", error);
    throw new Error("Unable to complete booking.");
  }
};

// ===============================
// 💺 Get seats by flight number
// ===============================
export const getSeatsByFlightNumberAPI = async (flightNumber) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/flight/seats/${flightNumber}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) throw new Error("Failed to fetch seats");

    return await res.json();
  } catch (error) {
    console.error("❌ getSeatsByFlightNumberAPI:", error);
    throw error;
  }
};

// ===============================
// 🔧 Update user details
// ===============================
export const updateUserAPI = async (username, updatedData) => {
  const response = await fetch(`${BASE_URL}/auth/updateuser/${username}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(updatedData),
  });

  if (response.ok) toast.success("User details updated successfully");
  else {
    toast.error("Failed to update user details");
    throw new Error("Failed to update user details");
  }

  return await response.json();
};

// ===============================
// 📋 Get all bookings for user
// ===============================
export const getUserBookings = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/user/bookings/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user bookings");

    return await res.json();
  } catch (error) {
    console.error("❌ getUserBookings:", error);
    throw error;
  }
};

// ===============================
// 🎟️ Get tickets by booking
// ===============================
export const getUserTickets = async (userId, bookingId) => {
  try {
    const res = await fetch(`${BASE_URL}/user/tickets/${userId}/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) throw new Error("Failed to fetch tickets");

    return await res.json();
  } catch (error) {
    console.error("❌ getUserTickets:", error);
    throw error;
  }
};

// ===============================
// ❌ Cancel booking
// ===============================
export const cancelBookingAPI = async (bookingId) => {
  try {
    const res = await fetch(`${BASE_URL}/user/cancel/${bookingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await res.json();
    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        `HTTP ${res.status}: Failed to cancel booking`;
      throw new Error(message);
    }

    toast.success(data.message || "Booking cancelled successfully");
    return data;
  } catch (error) {
    console.error("❌ cancelBookingAPI Error:", error.message);
    toast.error(error.message || "Failed to cancel booking");
    throw error;
  }
};
