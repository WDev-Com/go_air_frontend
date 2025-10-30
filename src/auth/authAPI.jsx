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
  // You can clear tokens from localStorage/sessionStorage here
  toast.success("Signed out successfully");
  return { data: "success" };
}
