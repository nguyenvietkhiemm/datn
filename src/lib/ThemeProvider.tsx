"use client";
import Sidebar from "@/component/sidebar/Sidebar";
import Header from "@/component/header/Header";
import TokenChecker from "@/checkCookies";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationPopup from "@/component/notification/Notification";
import { typeNoti } from "./model";

export default function ClientLayout({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const router = useRouter();
  const hiddenRoutes = ["/admin/login"];
  const isHiddenPage = hiddenRoutes.includes(pathname);
  const isAdminRoute = pathname.startsWith("/admin") && !isHiddenPage;
  const [notify, setNotify] = useState<typeNoti | null>(null);

  useEffect(() => {
    if (!isAdminRoute) return;

    const permissions = JSON.parse(
      localStorage.getItem("permissions") || "{}"
    );

    if (!permissions["admin:access"]) {
      router.replace("/admin/login");
      setNotify({
        message: "Tài khoản này không có quyền truy cập trang admin!",
        type: "warning",
      })
    }
  }, [isAdminRoute, router]);

  return (
    <div className="relative flex min-h-screen bg-gray-50 overflow-visible">
      {!isHiddenPage && <Sidebar />}
      <div className="relative flex-1 flex flex-col w-full">
        {!isHiddenPage && <Header />}

        <main
          className={`flex-1 transition-all duration-300 p-6
            ${isHiddenPage
              ? "flex items-center justify-center w-full max-w-3xl mx-auto"
              : "ml-[280px] lg:ml-[280px] md:ml-[200px] ml-0"
            }`}
        >
          <TokenChecker />
          {children}
        </main>
      </div>
      {notify && (
        <NotificationPopup
          message={notify.message}
          type={notify.type}
          onClose={() => setNotify(null)}
        />
      )}
    </div>
  );
}
