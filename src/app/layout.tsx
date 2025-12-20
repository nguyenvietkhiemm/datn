import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../../lib/ThemeProvider";
import ProgressPanel from "@/components/panel-progress/page";
import MiniChat from "@/components/chat-mini/page";
import localFont from "next/font/local";

const inter = localFont({
  src: [
    { path: "../assets/Inter_18pt-Regular.ttf", weight: "400" },
    { path: "../assets/Inter_18pt-Medium.ttf", weight: "500" },
    { path: "../assets/Inter_18pt-SemiBold.ttf", weight: "600" },
  ],
  variable: "--font-body",
  display: "swap",
});

const RobotoSlab = localFont({
  src : [
    { path: "../assets/RobotoSlab-Regular.ttf", weight: "400" },
    { path: "../assets/RobotoSlab-Medium.ttf", weight: "500" },
    { path: "../assets/RobotoSlab-Bold.ttf", weight: "700" },
  ],
  variable: "--font-heading",
})



export const metadata:Metadata = {
  title: "Lò luyện Online",
  description: "Mô tả website",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${RobotoSlab.variable}`}
    >
      <body className="antialiased font-body">
        <ClientLayout>
          {children}
          <MiniChat />
          <ProgressPanel />
        </ClientLayout>
      </body>
    </html>
  );
}
