import { toast } from "react-toastify";

// =============== LOGIN ===============
export async function loginUser({ username, password }) {
  try {
    const response = await fetch(`http://localhost:8080/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      toast.error("Login failed");
      throw new Error(errorText || "Login failed");
    }

    const data = await response.json();

    // ✅ Store important values in localStorage
    if (data.jwtToken) localStorage.setItem("jwtToken", data.jwtToken);
    if (data.refreshToken)
      localStorage.setItem("refreshToken", data.refreshToken);
    if (data.role) localStorage.setItem("role", data.role);
    if (data.username) localStorage.setItem("user", data.username);

    toast.success("Login successful");
    return { data };
  } catch (error) {
    console.error("Login error:", error);
    toast.error("Something went wrong during login");
    throw new Error(error.message || "Login request failed");
  }
}

// =============== SIGNUP ===============
export async function signupUser({ username, password }) {
  try {
    const response = await fetch(`http://localhost:8080/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      toast.error("Signup failed");
      throw new Error(errorText || "Signup failed");
    }

    const data = await response.json();
    toast.success("User created successfully");
    return { data };
  } catch (error) {
    console.error("Signup error:", error);
    toast.error("Something went wrong during signup");
    throw new Error(error.message || "Signup request failed");
  }
}

// =============== LOGOUT ===============
export async function signOutUser() {
  try {
    const response = await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
    });

    // Clear tokens from storage (if you stored them)
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    toast.success(response.data || "Signed out successfully");

    return { data: response.data };
  } catch (error) {
    console.error("Logout failed:", error);
    toast.error("Failed to sign out");
    throw error;
  }
}

// =============== CHECK USERNAME AVAILABILITY ===============

export async function checkUsername(username) {
  try {
    const response = await fetch(
      `http://localhost:8080/auth/checkusername?username=${encodeURIComponent(
        username
      )}`
    );

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message || "Username is available");
      return { data };
    } else {
      toast.error(data.message || "Username is not available");
      throw new Error(data.message || "Username check failed");
    }
  } catch (error) {
    console.error("Check username error:", error);
    toast.error("Something went wrong while checking username");
    throw new Error(error.message || "Check username request failed");
  }
}
