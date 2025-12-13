export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-slate-200">

      {/* Top divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-12 text-center">

        <div className="flex justify-center gap-4 text-slate-400 text-sm">
          <a className="hover:text-white">Facebook</a>
          <a className="hover:text-white">YouTube</a>
          <a className="hover:text-white">Zalo</a>
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
