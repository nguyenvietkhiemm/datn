"use client";

import { ThemeProvider } from "next-themes";
import Sidebar from "@/component/sidebar/Sidebar";
import Header from "@/component/header/Header";
import TokenChecker from "@/checkCookies";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const hiddenRoutes = ["/admin/login"];
  const isHiddenPage = hiddenRoutes.includes(pathname);

  return (
    <ThemeProvider attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <div className="relative flex min-h-screen bg-gray-50 overflow-visible">
        {!isHiddenPage && <Sidebar />}
        <div className="relative flex-1 flex flex-col w-full">
          {!isHiddenPage && <Header />}
          <main className={`sticky top-0 z-5 flex-1 p-6 transition-all duration-300
              ${isHiddenPage
              ? "flex items-center justify-center w-[700px] mx-auto"
              : "lg:ml-60 md:ml-45 ml-5"
            }`}>
            <TokenChecker />
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
