"use client";

import Image from "next/image";

export default function LoginImage() {
  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        minHeight: 420,
      }}
    >
      <Image
        src="/Lò Luyện.png"
        alt="Login"
        fill
        priority
        style={{
          objectFit: "contain",
          transform: "translateX(-20%) scale(0.9)", 
          transformOrigin: "center",
        }}
      />
    </div >
  );
}
