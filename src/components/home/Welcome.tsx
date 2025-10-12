"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Clock, Award } from "lucide-react";

export default function LandingPage() {
    const exams = [
        { id: 1, title: "Thi thử IELTS Listening", desc: "4 phần thi • 40 câu hỏi • 50 phút", link: "/exam/ielts-listening" },
        { id: 2, title: "Thi thử TOEIC Reading", desc: "7 phần thi • 100 câu hỏi • 75 phút", link: "/exam/toeic-reading" },
        { id: 3, title: "Thi thử IELTS Reading", desc: "3 phần thi • 40 câu hỏi • 60 phút", link: "/exam/ielts-reading" },
    ];

    const features = [
        { icon: <BookOpen className="text-blue-600 w-10 h-10" />, title: "Kho bài học phong phú", desc: "Hàng trăm bài học & đề thi được cập nhật thường xuyên." },
        { icon: <Clock className="text-blue-600 w-10 h-10" />, title: "Luyện tập mọi lúc", desc: "Học và thi thử ngay trên trình duyệt – không cần cài đặt." },
        { icon: <Award className="text-blue-600 w-10 h-10" />, title: "Đánh giá năng lực", desc: "Xem kết quả tức thì, phân tích chi tiết điểm mạnh và điểm yếu." },
        { icon: <GraduationCap className="text-blue-600 w-10 h-10" />, title: "Lộ trình học thông minh", desc: "Tự động gợi ý bài học phù hợp với năng lực hiện tại." },
    ];

    return (
        <main className="flex flex-col items-center justify-center text-gray-800">
            {/* HERO SECTION */}
            <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-blue-600 to-blue-800 text-white text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="z-10 px-6"
                >
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
                        Học tập & Thi thử <span className="text-yellow-300">Trực Tuyến</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                        Nền tảng học tập hiện đại giúp bạn rèn luyện kỹ năng, thi thử IELTS, TOEIC và nhiều chứng chỉ khác.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-yellow-400 text-gray-800 hover:bg-yellow-300 font-semibold px-8 py-6 rounded-xl">
                            Bắt đầu miễn phí
                        </Button>
                    </Link>
                </motion.div>
                <img src="/hero-bg.jpg" alt="Hero background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            </section>

            {/* FEATURES */}
            <section className="py-20 px-6 max-w-6xl text-center">
                <h2 className="text-3xl font-bold mb-12 text-blue-700">Tính năng nổi bật</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center"
                        >
                            {f.icon}
                            <h3 className="font-semibold text-xl mt-4 mb-2 text-blue-700">{f.title}</h3>
                            <p className="text-gray-600">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* EXAM LIST */}
            <section className="py-20 bg-blue-50 w-full">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Các bài thi nổi bật</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {exams.map((exam) => (
                            <motion.div
                                key={exam.id}
                                whileHover={{ y: -6 }}
                                transition={{ type: "spring", stiffness: 250 }}
                            >
                                <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                                    <CardHeader>
                                        <CardTitle className="text-blue-700 text-lg font-semibold">{exam.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-gray-600 flex flex-col gap-4">
                                        <p>{exam.desc}</p>
                                        <Link href={exam.link}>
                                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Vào thi</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-20 px-6 max-w-6xl text-center">
                <h2 className="text-3xl font-bold text-blue-700 mb-10">Học viên nói gì?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Ngọc Anh", text: "Trang web này giúp mình luyện IELTS Listening rất hiệu quả! Giao diện dễ dùng và điểm được chấm tự động.", img: "/students.jpg" },
                        { name: "Minh Quân", text: "Mình thích phần thi thử vì giống đề thật, kết quả chi tiết và có gợi ý cải thiện.", img: "/students.jpg" },
                        { name: "Hồng Nhung", text: "Cảm ơn đội ngũ phát triển! Trang web giúp mình cải thiện điểm TOEIC chỉ sau 2 tuần.", img: "/students.jpg" },
                    ].map((t, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white rounded-2xl shadow-md p-6 border border-gray-100"
                        >
                            <img src={t.img} alt={t.name} className="w-16 h-16 rounded-full mx-auto mb-4 object-cover" />
                            <p className="italic text-gray-600 mb-3">“{t.text}”</p>
                            <p className="font-semibold text-blue-700">{t.name}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white w-full">
                <h2 className="text-4xl font-bold mb-4">Sẵn sàng bắt đầu hành trình học tập của bạn?</h2>
                <p className="text-lg mb-8">Tham gia miễn phí và khám phá hàng trăm bài học & bài thi thử chất lượng.</p>
                <Link href="/signup">
                    <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-gray-800 font-semibold">
                        Đăng ký ngay
                    </Button>
                </Link>
            </section>
        </main>
    );
}
