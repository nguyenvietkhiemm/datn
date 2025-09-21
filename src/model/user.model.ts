export interface User {
   user_id: number;
   user_name: string;
   email: string;
   password_hash: string;
   birthday: Date;
   available: boolean; 
   reated_at: Date;
   role_id: number;
}
