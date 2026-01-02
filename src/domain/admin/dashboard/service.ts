import { getToken, getHeaders } from "@/lib/service";
import { API_URL } from "@/lib/service";

const DashBoardService = {
    async getDashboardStats() {
        const now = new Date();

        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const res = await fetch(`${API_URL}/dashboard?year=${year}&month=${month}`,
            {
                method: "GET",
                headers: getHeaders(getToken())
            }
        );
        return res.json()
    }
}

export default DashBoardService