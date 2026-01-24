import Cookies from "js-cookie";

export function getToken() {
    return Cookies.get("token")
}

export function getHeaders(token?: string, is_json: boolean = true) {
    const headers: Record<string, string> = {};

    if (is_json) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearers ${token}`;
    }

    return headers;
}

export const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND

export function FilterSearch(filterCondition: any, searchKeyword: string, url: string) {
    // Filter status  
    console.log(filterCondition);
    
        url += `&available=All`;

    // Filter topics
    if (filterCondition?.topic_ids && filterCondition.topic_ids.length > 0) {
        url += `&topic_ids=${filterCondition.topic_ids.join(",")}`;
    }
    
    if(filterCondition?.subject_id){
        url += `&subject_id=${filterCondition.subject_id}`
    }

    // Search
    if (searchKeyword.trim().length > 0) {
        url += `&keyword=${encodeURIComponent(searchKeyword)}`;
    }
    return url
}
