"use client";

import { ThemeProvider } from "next-themes";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ReduxProvider from "@/components/provider/ReduxProvider";
import TokenChecker from "@/checkCookies";
import { usePathname } from "next/navigation";
import ProgressPanel from "@/components/panel-progress/page";
import MiniChat from "@/components/chat-mini/page";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname();
    const isDoingExam = pathname.endsWith("/do");
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
                        {!isDoingExam && <MiniChat />}
                        {!isDoingExam && <ProgressPanel />}
                    </main>
                    {!isDoingExam && <Footer />}
                </div>
            </ReduxProvider>
        </ThemeProvider>
    );
}
