export type User = {
    user_id: number;
    user_name: string;
    email: string;
    birthday: string;
    created_at: string;
    available: boolean;
    role_name: string;
};

export interface UserQuery {
    page: number;
    keyword?: string;
    role?: "ADMIN" | "USER";
    status?: "true" | "false";
}

