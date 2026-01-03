import { getToken, getHeaders } from "@/lib/service";
import { API_URL } from "@/lib/service";

const DashBoardService = {

    /* CARD */ 
    async getDashboardStatsCard() {
        const now = new Date();

        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const res = await fetch(`${API_URL}/dashboard/card?year=${year}&month=${month}`,
            {
                method: "GET",
                headers: getHeaders(getToken())
            }
        );
        return res.json()
    },

    /* LINE */ 
    async getDashboarStatsLine() {
        const res = await fetch(`${API_URL}/dashboard/line`,
            {
                method: "GET",
                headers: getHeaders(getToken())
            })
        return res.json()
    },

      /* ACTIVE USERS */
    async getDashboardActiveUsers() {
        const res = await fetch(`${API_URL}/dashboard/active-users`, {
            method: "GET",
            headers: getHeaders(getToken()),
        });

        return res.json();
    },

    /*  PIE  */
    async getDashboardPie() {
        const res = await fetch(`${API_URL}/dashboard/pie`, {
            method: "GET",
            headers: getHeaders(getToken()),
        });

        return res.json();
    },

    /*  TABLE  */
    async getDashboardTable() {
        const res = await fetch(`${API_URL}/dashboard/table`, {
            method: "GET",
            headers: getHeaders(getToken()),
        });

        return res.json();
    },
}

export default DashBoardService