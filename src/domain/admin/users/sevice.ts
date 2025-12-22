import { API_URL, getToken, getHeaders } from "@/lib/service";
import { User, UserQuery } from "./type";

export const UserService = {
    async fetchUsers(
        query: UserQuery
    ): Promise<{ users: User[]; last_page: number }> {
        const token = getToken();

        const params = new URLSearchParams();
        params.set("page", query.page.toString());

        if (query.keyword) params.set("search", query.keyword);
        if (query.role) params.set("role", query.role);
        if (query.status) params.set("status", query.status);

        const res = await fetch(`${API_URL}/users?${params.toString()}`, {
            headers: getHeaders(token),
        });

        const data = await res.json();

        return {
            users: data.data.users as User[],
            last_page: data.data.totalPages,
        };
    },

    async deleteUser(userId: number) {
        const token = getToken()
        await fetch(`${API_URL}/users/remove/${userId}`, {
            method: "DELETE",
            headers: getHeaders(token),
        });
    },

    async updateUser(userId: number, payload: Partial<User>) {
        const token = getToken()
        const res = await fetch(`${API_URL}/users/update/${userId}`, {
            method: "PUT",
            headers: getHeaders(token),
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Cập nhật thất bại");
    },

}