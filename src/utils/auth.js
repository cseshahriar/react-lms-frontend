import { useAuthStore } from "../store/auth";
import apiInstance from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookie from "js-cookie";
import Swal from "sweetalert2";

export const login = async(email, password) => {
    try {
        const {data, status } = await apiInstance.post(`user/token/`, {
            email, password
        });
        if(status === 200) {
            setAuthUser(data.access, data.refresh);
            alert("Login successful");
        }
        return {data, error: null};
    } catch (error) {
        return {
            data: null,
            error: error.response.data?.detail || "Something went wrong"
        }
    }
};

export const register = async(full_name, email, password, password2) => {
    try {
        const {data, status } = await apiInstance.post(`user/register/`, {
            full_name, email, password, password2
        });
        await login(email, password);
        alert("Registration successful");
        return {data, error: null};
    } catch (error) {
        return {
            data: null,
            error: error.response.data?.detail || "Something went wrong"
        }
    }
};

export const logout = () => {
    Cookie.remove("access_token");
    Cookie.remove("refresh_token");
    useAuthStore.getState().setUser(null);
    alert("You have been logged out");
};

export const setUser = async() => {
    const access_token = Cookie.get("access_token");
    const refresh_token = Cookie.get("refresh_token");
    if(!access_token || !refresh_token) {
        alert("Token does not exists");
        return;
    }

    if(isAccessTokenExpired(access_token)) {
        const response = getRefreshedToken(refresh_token);
        setAuthUser(response.access, response.refresh);
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

    const user = jwtDecode(access_token) ?? null;
    if(user) {
        useAuthStore.getState().setUser(user);
    }
    setAuthUser.getState().setLoading(false);
};

export const getRefreshedToken = async() => {
    const refresh_token = Cookie.get("refresh_token");
    const response = await apiInstance.post(`token/refresh`, {
        refresh: refresh_token,
    })
    return response.data;
};

export const isAccessTokenExpired = (access_token) => {
    try {
        const decodedToken = jwtDecode(access_token);
        return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
        console.log(error);
        return true;
    }
};