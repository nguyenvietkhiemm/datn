import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "../../lib/ThemeProvider";
import ProgressPanel from "@/components/panel-progress/page";
import MiniChat from "@/components/chat-mini/page";
import localFont from "next/font/local";

const robotoSlab = localFont({
  src: [
    { path: "../assets/RobotoSlab-Regular.ttf", weight: "400" },
    { path: "../assets/RobotoSlab-Medium.ttf", weight: "500" },
    { path: "../assets/RobotoSlab-Bold.ttf", weight: "700" },
  ],
  variable: "--font-roboto-slab",
  display: "swap",
});

const poppins = localFont({
  src: [
    { path: "../assets/Poppins-Regular.ttf", weight: "400" },
    { path: "../assets/Poppins-Medium.ttf", weight: "500" },
  ],
  variable: "--font-body",
});

// const inter = localFont({
//   src: [
//     { path: "../assets/Inter_18pt-Regular.ttf", weight: "400" },
//     { path: "../assets/Inter_18pt-Medium.ttf", weight: "500" },
//     { path: "../assets/Inter_18pt-SemiBold.ttf", weight: "600" },
//     { path: "../assets/Inter_18pt-Bold.ttf", weight: "700" },
//   ],
//   variable: "--font-header",
//   display: "swap",
// });

const openSans = localFont({
  src : [
    {path : "../assets/OpenSans-Regular.ttf", weight : "400"},
    {path : "../assets/OpenSans-Medium.ttf", weight : "500"}
  ],
  variable: "--font-heading",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${robotoSlab.variable} ${poppins.variable} ${openSans.variable}`}
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
