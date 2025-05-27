import { useAuthStore } from "../store/auth";
import axios from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import Swal from "sweetalert2";

// Helper function to validate token structure
const isValidToken = (token) => {
  return token && typeof token === "string" && token.split(".").length === 3;
};

// Enhanced login function with better error handling
export const login = async (email, password) => {
  try {
    const { data, status } = await axios.post(`user/token/`, {
      email,
      password,
    });

    if (status === 200) {
      if (!isValidToken(data.access) || !isValidToken(data.refresh)) {
        throw new Error("Invalid tokens received from server");
      }
      setAuthUser(data.access, data.refresh);
    }

    return { data, error: null };
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail ||
      error.message ||
      "Login failed. Please try again.";
    console.error("Login error:", errorMessage);

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: errorMessage,
    });

    return { data: null, error: errorMessage };
  }
};

// Improved register function
export const register = async (full_name, email, password, password2) => {
  try {
    const { data } = await axios.post(`user/register/`, {
      full_name,
      email,
      password,
      password2,
    });

    await login(email, password);
    return { data, error: null };
  } catch (error) {
    let errorMessage = "Registration failed. Please try again.";

    if (error.response?.data) {
      errorMessage = Object.values(error.response.data)
        .flatMap(err => Array.isArray(err) ? err : [err])
        .join("\n");
    }

    Swal.fire({
      icon: "error",
      title: "Registration Failed",
      text: errorMessage,
    });

    return {
      data: null,
      error: errorMessage,
    };
  }
};

// Secure logout function
export const logout = () => {
  Cookie.remove("access_token", { path: "/", secure: true, sameSite: "strict" });
  Cookie.remove("refresh_token", { path: "/", secure: true, sameSite: "strict" });
  useAuthStore.getState().setUser(null);

  // Optional: Redirect to login page
  window.location.href = "/login";
};

// Robust token expiration check
export const isAccessTokenExpired = (access_token) => {
  if (!isValidToken(access_token)) {
    console.error("Invalid token provided to isAccessTokenExpired");
    return true;
  }

  try {
    const decodedToken = jwtDecode(access_token);
    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

// Secure token refresh function
export const getRefreshToken = async () => {
  const refresh_token = Cookie.get("refresh_token");

  if (!isValidToken(refresh_token)) {
    console.error("Invalid refresh token");
    logout();
    throw new Error("Invalid refresh token");
  }

  try {
    const response = await axios.post(`user/token/refresh/`, {
      refresh: refresh_token,
    });

    if (!isValidToken(response.data.access)) {
      throw new Error("Invalid access token received from refresh");
    }

    return response;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    logout();
    throw error;
  }
};

// Secure auth user setup
export const setAuthUser = (access_token, refresh_token) => {
  if (!isValidToken(access_token) || !isValidToken(refresh_token)) {
    console.error("Invalid tokens provided to setAuthUser");
    logout();
    return;
  }

  try {
    Cookie.set("access_token", access_token, {
      expires: 1,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    Cookie.set("refresh_token", refresh_token, {
      expires: 7,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    const user = jwtDecode(access_token);
    useAuthStore.getState().setUser(user);
  } catch (error) {
    console.error("Error setting auth user:", error);
    logout();
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};
export const setUser = async () => {
  useAuthStore.getState().setLoading(true);

  try {
    const access_token = Cookie.get("access_token");
    const refresh_token = Cookie.get("refresh_token");

    if (!access_token || !refresh_token) {
      console.log("No tokens available");
      useAuthStore.getState().setLoading(false);
      useAuthStore.getState().setUser(null); // Explicitly set user to null
      return;
    }

    if (isAccessTokenExpired(access_token)) {
      try {
        const response = await getRefreshToken();
        if (response?.data?.access) {
          setAuthUser(response.data.access, response.data.refresh);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        logout();
      }
    } else {
      setAuthUser(access_token, refresh_token);
    }
  } catch (error) {
    console.error("Error setting user:", error);
    logout();
  } finally {
    useAuthStore.getState().setLoading(false);
  }
};