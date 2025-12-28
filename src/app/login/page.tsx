"use client";

import Auth from "@/components/auth/Auth";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout>
      <Auth isLogin={true} />
    </AuthLayout>
  );
}
