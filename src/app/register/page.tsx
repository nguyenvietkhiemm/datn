"use client";

import Auth from "@/components/auth/Auth";
import AuthLayout from "@/components/auth/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <Auth isLogin={false} />
    </AuthLayout>
  );
}
