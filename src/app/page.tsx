"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  // Danh sách bài thi 
  const listExam = [
    {
      id: 1,
      title: "IELTS Simulation Listening Set 1",
      time: "52 phút • 4 phần thi • 40 câu hỏi",
      link: "/exam/detail",
    },
    {
      id: 2,
      title: "IELTS Simulation Listening Set 10",
      time: "52 phút • 4 phần thi • 40 câu hỏi",
      link: "/login",
    },
    {
      id: 3,
      title: "IELTS Simulation Reading Set 5",
      time: "60 phút • 3 phần thi • 40 câu hỏi",
      link: "/login",
    },
  ];

  return (
    <main className={styles.container}>
      {/*Banner */}
      <section className={styles.banner}>
        <img
          src="/banner.jpg"
          alt="Study Banner"
          className={styles.bannerImage}
        />
      </section>

      {/* Danh sách bài thi nổi bật */}
      <section className={styles.cards}>
        <h2 className={styles.title}>Danh sách bài thi nổi bật</h2>

        <div className={styles.cardList}>
          {listExam.map((exam) => (
            <article className={styles.card} key={exam.id}>
              <h3 className={styles.cardTitle}>{exam.title}</h3>
              <p className={styles.cardInfo}>{exam.time}</p>
              <Link href={exam.link} className={styles.btn}>
                Chi tiết
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
