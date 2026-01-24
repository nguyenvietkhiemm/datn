import { getToken, getHeaders, API_URL } from "../../lib/service";

export const RoadmapService = {
    async getAll() {
        const token = getToken();
        const url = `${API_URL}/roadmap`;

        const res = await fetch(url, {
            method: "GET",
            headers: getHeaders(token),
        });

        return await res.json();
    },

};
