import { useAuthStore } from "../store/auth";
import apiInstance from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import Swal from "sweetalert2";

export const login = async (email, password) => {
    try {
        const { data, status } = await apiInstance.post(`user/token/`, { email, password });
        if (status === 200) {
            await setAuthUser(data.access, data.refresh);
            return { data, error: null };
        }
    } catch (error) {
        const backendError = error.response?.data || {};
        return {
            data: null,
            error: {
                // Email-specific errors (e.g., "Invalid email format")
                email: backendError.email || null,
                // Password-specific errors (e.g., "Password too short")
                password: backendError.password || null,
                // General errors (e.g., "No active account found")
                detail: backendError.detail ? [backendError.detail] : null,
                // Non-field errors (e.g., "Account disabled")
                nonFieldErrors: backendError.non_field_errors || null,
            },
        };
    }
};

export const register = async(full_name, email, password, password2) => {
    try {
        const response = await apiInstance.post(`user/register/`, {
            full_name, email, password, password2
        });
        await login(email, password);
        return { data: response.data, error: null };
    } catch (error) {
        return {
            data: null,
            error: error.response?.data || {
                non_field_errors: ["Something went wrong"]
            }
        };
    }
};

export const logout = () => {
    Cookie.remove("access_token");
    Cookie.remove("refresh_token");
    useAuthStore.getState().setUser(null);
    console.log("You have been logged out");
};

export const setUser = async () => {
    const access_token = Cookie.get("access_token");
    const refresh_token = Cookie.get("refresh_token");

    if (!access_token || !refresh_token) {
        return;
    }

    if (isAccessTokenExpired(access_token)) {
        try {
            const response = await getRefreshedToken();
            setAuthUser(response.access, response.refresh);
        } catch (err) {
            logout(); // optionally log the user out if refresh fails
        }
    } else {
        setAuthUser(access_token, refresh_token);
    }
};


export const setAuthUser = (access_token, refresh_token) => {
    Cookie.set("access_token", access_token, {
        expires: 1, // 1 day
        secure: true
    });
    Cookie.set("refresh_token", refresh_token, {
        expires: 7, // 7 day
        secure: true
    });

    try {
        const user = jwtDecode(access_token);
        console.log('Decoded user:', user); // Add this for debugging
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setUser(user);
    } catch (error) {
        console.error('Token decoding failed:', error);
        useAuthStore.getState().setUser(null);
    }
    useAuthStore.getState().setLoading(false);
};

export const getRefreshedToken = async () => {
    const refresh_token = Cookie.get("refresh_token");

    if (!refresh_token) {
        throw new Error("No refresh token found");
    }

    const response = await apiInstance.post(`user/token/refresh/`, {
        refresh: refresh_token,
    });

    return response.data;
};


export const isAccessTokenExpired = (access_token) => {
    try {
        const decodedToken = jwtDecode(access_token);
        return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
        return true;
    }
};