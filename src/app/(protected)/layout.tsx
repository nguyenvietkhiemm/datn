"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  useEffect(() => {
    const token = true;
    if (!token) {
      router.replace("/login");
    }
  }, []);

  return <>{children}</>
}
