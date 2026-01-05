"use client";
import Sidebar from "@/component/sidebar/Sidebar";
import Header from "@/component/header/Header";
import TokenChecker from "@/checkCookies";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const router = useRouter();

  const hiddenRoutes = ["/admin/login"];
  const isHiddenPage = hiddenRoutes.includes(pathname);

  const isAdminRoute = pathname.startsWith("/admin") && !isHiddenPage;

  useEffect(() => {
    if (!isAdminRoute) return;

    const permissions = JSON.parse(
      localStorage.getItem("permissions") || "{}"
    );

    if (permissions["*"] !== true) {
      router.replace("/403");
    }
  }, [isAdminRoute, router]);

  return (
    <div className="relative flex min-h-screen bg-gray-50 overflow-visible">
      {!isHiddenPage && <Sidebar />}
      <div className="relative flex-1 flex flex-col w-full">
        {!isHiddenPage && <Header />}

        <main
          className={`flex-1 transition-all duration-300 p-6
            ${
              isHiddenPage
                ? "flex items-center justify-center w-full max-w-3xl mx-auto"
                : "ml-[280px] lg:ml-[280px] md:ml-[200px] ml-0"
            }`}
        >
          <TokenChecker />
          {children}
        </main>
      </div>
    </div>
  );
}
