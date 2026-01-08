"use client";

import { motion } from "framer-motion";
import { BookOpen, Award, Clock, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    // chỉ riêng trang home mới có margin-top âm để kéo header lên trên
    <main className="bg-white text-gray-800 font-sans mt-[-80px]">
      {/* ================= HERO ================= */}
      <section id='hero' className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden flex items-center justify-center px-6 text-center">

        {/* Layer 1: Gradient nền */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"></div>

        {/* Layer 2: Ảnh background */}
        <div className="absolute inset-0">
          <img
            src="/slider_background.jpg"
            alt="Học tập online"
            className="w-full h-full object-cover opacity-45"
          />
        </div>

        {/* Layer 3: Overlay cân màu (KHÔNG đè ảnh) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/40"></div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h1 className="font-heading text-5xl md:text-6xl mb-6 leading-tight drop-shadow-lg">
            Bạn sẽ là ai<br />khi ra khỏi phòng thi?
          </h1>
          <p className="font-heading text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Học không chỉ để thi, học để bứt phá chính mình.
          </p>

          <Link
            href="/practice"
            className="
                  font-heading
                  text-lg
                  relative overflow-hidden
                  bg-gradient-to-r from-amber-400 to-orange-400
                  hover:from-amber-300 hover:to-orange-300
                  text-gray-600 font-semibold
                  px-10 py-4 rounded-2xl
                  shadow-lg shadow-amber-400/30
                  hover:shadow-xl hover:shadow-amber-400/40
                  transition-all duration-300
                  active:scale-[0.97]
                "
          >
            Bắt đầu ngay!
          </Link>

        </motion.div>

        {/* Decorative blur (rất nhẹ) */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-700/20 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-700/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </section>





      {/* ================= FEATURED COURSES ================= */}
      <section className="py-24 bg-gray-50 text-center">
        <h2 className="font-heading text-3xl font-bold text-slate-800 mb-12">BỘ ĐỀ THI NỔI BẬT</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            { title: "Toán học 12", desc: "Ôn luyện toàn diện kiến thức và bài tập theo chương.", search: "Toán" },
            { title: "Ngữ văn 12", desc: "Hệ thống bài giảng chi tiết, luyện viết & đọc hiểu.", search: "Văn" },
            { title: "Tiếng Anh 12", desc: "Luyện ngữ pháp, từ vựng và các đề thi thật.", search: "Tiếng anh" },
            { title: "Vật lý 12", desc: "Tổng hợp bài tập trọng tâm và đề thi thử chuẩn cấu trúc.", search: "Vật lý" },
            { title: "Hóa học 12", desc: "Các chuyên đề nâng cao và bài tập chọn lọc.", search: "Hoá học" },
            { title: "Lịch sử 12", desc: "Ôn luyện nhanh, nắm vững các mốc thời gian & sự kiện.", search: "Lịch sử" },
          ].map((course, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg p-6 text-left border border-gray-100"
            >
              <BookOpen className="w-10 h-10 text-indigo-800 mb-4" />
              <h3 className="font-heading text-xl font-bold text-slate-800 mb-2">
                {course.title}
              </h3>
              <p className="font-heading text-slate-600 mb-4">
                {course.desc}
              </p>
              <Link
                href={{
                  pathname: '/practice',
                  query: { search: course.search }, 
                }}
                className="text-indigo-500 font-medium inline-flex items-center hover:text-indigo-600 transition">
                Bắt đầu học tập <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>




      {/* ================= WHY CHOOSE US ================= */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-24 text-center overflow-hidden">

        {/* subtle overlay để trải màu */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30" />

        <h2 className="relative z-10 font-heading text-3xl font-bold text-slate-100 mb-12">
          Vì sao nên chọn chúng tôi?
        </h2>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            {
              icon: <BookOpen className="w-10 h-10 text-amber-300 mb-3" />,
              title: "Đề thi đa dạng",
              desc: "Hàng trăm đề thi thử và bài luyện tập theo từng môn học, cập nhật thường xuyên."
            },
            {
              icon: <Award className="w-10 h-10 text-amber-300 mb-3" />,
              title: "Đánh giá năng lực thông minh",
              desc: "Hệ thống tự động chấm điểm và phân tích chi tiết điểm mạnh, điểm yếu."
            },
            {
              icon: <Clock className="w-10 h-10 text-amber-300 mb-3" />,
              title: "Học mọi lúc, mọi nơi",
              desc: "Luyện tập và thi thử trực tuyến trên mọi thiết bị, không cần cài đặt."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 180 }}
              className="
                p-6 rounded-2xl text-left
                bg-white/10 backdrop-blur-lg
                border border-white/15
                shadow-lg shadow-black/20
                hover:bg-white/15 transition
              "
            >
              {item.icon}

              <h3 className="font-heading text-xl font-semibold text-slate-100 mb-2">
                {item.title}
              </h3>

              <p className="font-body text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>



      {/* ================= ABOUT ================= */}
      <section className="py-24 bg-slate-50 text-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center px-4">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl font-bold text-slate-800 mb-4">
              Về nền tảng của chúng tôi
            </h2>

            <p className="font-sans text-slate-600 mb-6 leading-relaxed">
              Chúng tôi mang đến giải pháp học tập thông minh, kết hợp công nghệ và giáo dục,
              giúp học sinh ôn luyện hiệu quả, làm bài thi thử như thật,
              và đánh giá năng lực chính xác nhất.
            </p>

            <ul className="space-y-3 font-sans text-slate-700">
              {[
                "Kho đề thi phong phú",
                "Tự động chấm điểm & thống kê",
                "Theo dõi tiến độ học tập",
                "Lộ trình ôn thi thông minh"
              ].map((item, i) => (
                <li key={i} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            src="/students.jpg"
            alt="Students"
            className="rounded-2xl shadow-md"
          />
        </div>
      </section>





      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 bg-slate-50 text-center">
        <h2 className="font-heading text-3xl font-bold text-slate-800 mb-12">
          Học sinh nói gì?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            {
              name: "Lan Anh",
              text: "Trang web giúp mình luyện đề Toán rất hiệu quả, dễ sử dụng và có thống kê điểm rõ ràng."
            },
            {
              name: "Minh Hoàng",
              text: "Các đề thi thử giống thật đến 90%, nhờ đó mình tự tin hơn rất nhiều trước kỳ thi."
            },
            {
              name: "Thu Hằng",
              text: "Giao diện đẹp, bài học chi tiết và có phân tích điểm yếu giúp mình học tốt hơn."
            }
          ].map((t, i) => (
            <div
              key={i}
              className="
          bg-white rounded-2xl p-6 text-left
          border border-slate-100
          shadow-sm hover:shadow-md transition
          hover:-translate-y-1
          transition-transform
        "
            >
              <p className="relative italic text-slate-600 pl-6">
                <span className="absolute left-0 top-0 text-4xl text-slate-300">“</span>
                {t.text}
              </p>


              <h4 className="font-heading font-semibold text-blue-700 text-right">
                — {t.name}
              </h4>

            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
