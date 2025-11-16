import { toast } from "react-toastify";

const BASE_URL = "http://localhost:8080";

export const extractMessage = (msg) => {
  if (!msg) return "";

  const match = msg.match(/\((.*?)\)/);

  return match ? match[1].trim() : msg.trim();
};

// For Autocomplete Functionality
export const getAirportSuggestionsAPI = async (type, query) => {
  const token = localStorage.getItem("jwtToken");
  // console.log("type : ", type, " query : ", query);
  try {
    const response = await fetch(
      `${BASE_URL}/user/airport-suggestions?type=${type}&query=${query}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let data = await response.json();
    // console.log("data : ", data);
    return data;
  } catch (error) {
    toast.error(extractMessage(error.message));
    throw error;
  }
};

// Search Flights
export const searchFlightsAPI = async (params) => {
  const token = localStorage.getItem("jwtToken");

  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value)
  );

  const queryParams = new URLSearchParams(filteredParams).toString();
  const url = `${BASE_URL}/user/flights/search?${queryParams}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      toast.error(
        extractMessage(data?.message) ||
          `HTTP ${response.status} : Failed to fetch flights`
      );
    }

    return data;
  } catch (error) {
    toast.error(extractMessage(error.message));
    throw error;
  }
};

// Get user by username
export const getUserByUsernameAPI = async (username) => {
  try {
    const token = localStorage.getItem("jwtToken");

    const res = await fetch(`${BASE_URL}/user/username/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      const err = await res.text();
      toast.error(extractMessage(err) || "Failed to fetch user");
    }

    return await res.json();
  } catch (error) {
    toast.error(extractMessage(error.message));
    throw error;
  }
};

// Get flight by flight number
export const getFlightByNumberAPI = async (flightNumber) => {
  try {
    const token = localStorage.getItem("jwtToken"); // 👈 get token from localStorage

    const res = await fetch(`${BASE_URL}/admin/flights/${flightNumber}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      toast.error(
        `Failed to fetch flight details: ${errorText || res.statusText}`
      );
    }

    return await res.json();
  } catch (error) {
    toast.error(extractMessage(error));
    console.error("❌ getFlightByNumberAPI:", error);
    throw new Error("Unable to retrieve flight details.");
  }
};

// Book flight
export const bookFlightAPI = async (userID, bookingPayload) => {
  try {
    const token = localStorage.getItem("jwtToken");

    const res = await fetch(
      `${BASE_URL}/api/payment/create-checkout-session/${userID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(bookingPayload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(extractMessage(data?.message) || "Booking failed");
    }

    // redirect to Stripe
    window.location.href = data.url;

    return data;
  } catch (error) {
    toast.error(extractMessage(error.message));
    throw error;
  }
};

// Get seats by flight number
export const getSeatsByFlightNumberAPI = async (flightNumber) => {
  try {
    const token = localStorage.getItem("jwtToken"); // 👈 get token from localStorage

    const res = await fetch(`${BASE_URL}/user/flight/seats/${flightNumber}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) toast.error("Failed to fetch seats");

    return await res.json();
  } catch (error) {
    toast.error(extractMessage(error.message));
    console.error(" getSeatsByFlightNumberAPI:", error);
    throw error;
  }
};

// Update user details
export const updateUserAPI = async (username, updatedData) => {
  const token = localStorage.getItem("jwtToken"); // 👈 get token from localStorage

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
    // throw new Error("Failed to update user details");
  }

  return await response.json();
};

// Get all bookings for user
export const getUserBookings = async (userId) => {
  try {
    const token = localStorage.getItem("jwtToken"); // 👈 get token from localStorage

    const res = await fetch(`${BASE_URL}/user/bookings/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) toast.error("Failed to fetch user bookings");

    return await res.json();
  } catch (error) {
    console.error("getUserBookings:", error);
    throw error;
  }
};

//  Get tickets by booking

export const getUserTickets = async (userId, bookingId) => {
  try {
    const token = localStorage.getItem("jwtToken"); // 👈 get token from localStorage

    const res = await fetch(`${BASE_URL}/user/tickets/${userId}/${bookingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) toast.error("Failed to fetch tickets");

    return await res.json();
  } catch (error) {
    console.error(" getUserTickets:", error);
    throw error;
  }
};

// Cancel booking
export const cancelBookingAPI = async (bookingId) => {
  try {
    const token = localStorage.getItem("jwtToken"); // 👈 get token from localStorage

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

    toast.success(
      extractMessage(data.message) || "Booking cancelled successfully"
    );
    return data;
  } catch (error) {
    console.error("cancelBookingAPI Error:", error.message);
    toast.error(error.message || "Failed to cancel booking");
    throw error;
  }
};
