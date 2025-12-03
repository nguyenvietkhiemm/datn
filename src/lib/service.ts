import Cookies from "js-cookie";

export function getToken (){
    return Cookies.get("token")
}

export function getHeaders (token? : string){
    return {
        "Content-Type" : "application/json",
        "Authoration" : `Bearer ${token}`
    }
}
export const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND