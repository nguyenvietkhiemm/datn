"use client";

import { ThemeProvider } from "next-themes";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ReduxProvider from "@/components/provider/ReduxProvider";
import TokenChecker from "@/checkCookies";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class"
            // defaultTheme="light"
            enableSystem={false}>
            <ReduxProvider>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1 min-h-screen pt-[80px]">
                        <TokenChecker />
                        {children}
                    </main>
                    <Footer />
                </div>
            </ReduxProvider>
        </ThemeProvider>
    );
}
