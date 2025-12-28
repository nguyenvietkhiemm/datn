"use client";

import LoginImage from "@/components/login-image/page";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            style={{
                minHeight: "calc(100vh - 64px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f5f7fb",
            }}
        >
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    width: 900,
                    maxWidth: "90%",
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                }}
            >
                <LoginImage />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%"
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
