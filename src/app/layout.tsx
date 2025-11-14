import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { ThemeProvider } from "next-themes";
import ReduxProvider from "@/components/provider/ReduxProvider";
import TokenChecker from "@/checkCookies";
import { Roboto_Slab } from "next/font/google";
import ClientLayout from "@/lib/ThemeProvider";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-slab",
});

export const metadata: Metadata = {
  title: "Nền tảng học tập trực tuyến",
  description: "Luyện thi, ôn tập, đánh giá năng lực dễ dàng mọi lúc, mọi nơi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={robotoSlab.variable}
    >
      <body className="antialiased font-body">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
