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
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}

export const API_URL = process.env.NEXT_PUBLIC_ENDPOINT_BACKEND

export function FilterSearch(filterCondition: any, searchKeyword: string, url: string) {
    // Filter status
    if (filterCondition?.status) {
        url += `&status=${filterCondition.status}`;
    }

    // Filter topics
    if (filterCondition?.topics && filterCondition.topics.length > 0) {
        url += `&topics=${filterCondition.topics.join(",")}`;
    }

    // Search
    if (searchKeyword.trim().length > 0) {
        url += `&search=${encodeURIComponent(searchKeyword)}`;
    }
    return url
}
