export const searchFlightsAPI = async (params) => {
  // ✅ Remove empty/undefined/null values
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  console.log("🔍 searchFlightsAPI Params:", filteredParams);

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

  console.log("🔍 Final API URL:", url.toString());

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
