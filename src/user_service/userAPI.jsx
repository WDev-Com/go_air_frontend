export const searchFlightsAPI = async (params) => {
  // ✅ Remove empty/undefined/null values
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  // console.log("🔍 searchFlightsAPI Params:", filteredParams);

  // ✅ Build dynamic query string (support arrays like List<String>)
  const queryParams = new URLSearchParams();

  Object.entries(filteredParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      // ✅ For lists like airlines, send multiple params:
      // airlines=IndiGo&airlines=AirIndia
      value.forEach((v) => queryParams.append(key, v));
    } else {
      queryParams.append(key, value);
    }
  });

  const url = `http://localhost:8080/user/flights/search?${queryParams.toString()}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`, // Uncomment if needed
      },
    });

    // ✅ Parse JSON safely
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        data?.message ||
        data?.["message "] || // in case backend mistakenly returns with space
        data?.error ||
        `HTTP ${response.status}: Failed to fetch flights`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error("❌ searchFlightsAPI Error:", error.message);
    throw error; // rethrow so UI components can handle it
  }
};

const BASE_URL = "http://localhost:8080";

// ✅ 1. Get user by username
export const getUserByUsernameAPI = async (username) => {
  try {
    const res = await fetch(`${BASE_URL}/user/username/${username}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch user details: ${errorText || res.statusText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("❌ Error in getUserByUsernameAPI:", error);
    throw new Error("Unable to retrieve user details. Please try again later.");
  }
};

// ✅ 2. Get flight by flight number
export const getFlightByNumberAPI = async (flightNumber) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/flights/${flightNumber}`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch flight details: ${errorText || res.statusText}`
      );
    }
    return await res.json();
  } catch (error) {
    console.error("❌ Error in getFlightByNumberAPI:", error);
    throw new Error(
      "Unable to retrieve flight details. Please try again later."
    );
  }
};

// ✅ 3. Book flight for user
export const bookFlightAPI = async (userID, bookingData) => {
  try {
    const res = await fetch(`${BASE_URL}/user/book/${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Booking failed: ${errorText || res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error in bookFlightAPI:", error);
    throw new Error(
      "Unable to complete booking. Please check your details and try again."
    );
  }
};

// ✅ Get seats by flight number
export const getSeatsByFlightNumberAPI = async (flightNumber) => {
  try {
    let url = `${BASE_URL}/admin/flight/seats/${flightNumber}`;
    console.log("Fetching seats from URL:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch seats");
    }
    return await response.json();
  } catch (err) {
    console.error("❌ getSeatsByFlightNumberAPI Error:", err);
    throw err;
  }
};
