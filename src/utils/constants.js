import userData from "../views/plugin/UserData";

export const API_BASE_URL = `http://127.0.0.1:8000/api/v1/`;
export const BASE_URL = `http://127.0.0.1:8000/`;
export const userId = userData()?.user_id;
export const teacherId = userData()?.teacher_id;
export const PAYPAL_CLIENT_ID = "test"