import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function userData() {
    let access_token = Cookies.get("access_token");
    let refresh_token = Cookies.get("refresh_token");

    if(access_token && refresh_token) {
        const token = refresh_token;
        const decode = jwtDecode(token);
        return decode;
    }
}

export default userData;