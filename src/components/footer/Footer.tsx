import { usePathname } from "next/navigation";

export default function Footer() {
  const path = usePathname();
  if(path === "/exam/") return
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-slate-200 border-t border-white/10">

      <div className="max-w-6xl mx-auto px-6 py-12 text-center">

        <div className="flex justify-center gap-4 text-slate-400 text-sm mb-4">
          <a className="hover:text-white cursor-pointer">Facebook</a>
          <a className="hover:text-white cursor-pointer">YouTube</a>
          <a className="hover:text-white cursor-pointer">Zalo</a>
        </div>

        <p className="text-base md:text-lg font-semibold text-white mb-2 tracking-wide">
          © Lò luyện Online
        </p>

        <p className="text-sm text-slate-400 mb-4">
          Học không chỉ để thi, học để bứt phá chính mình.
        </p>

        <p className="text-xs text-slate-500">
          Mọi quyền được bảo lưu.
        </p>

      </div>
    </footer>
  );
}
