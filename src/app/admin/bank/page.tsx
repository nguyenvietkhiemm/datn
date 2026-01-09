"use client";
import { useEffect, useState } from "react";
import styles from "./Bank.module.css";
import FilterExam from "@/component/filter/Filter/Filter";
import { useRouter } from "next/navigation";
import Search from "@/component/search/Search";
import Pagination from "@/component/pagination/Pagination";
import { Bank, BankQuery } from "@/domain/admin/banks/type";
import { BankService } from "@/domain/admin/banks/service";

export default function Exam() {

  const [bank, setBank] = useState<Bank[]>([])
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [query, setQuery] = useState<BankQuery>({
    page: 1,
    searchKeyword: "",
  });
  const [filterUI, setFilterUI] = useState({
    subject: "All" as number | "All",
    topic: "All" as number | "All",
    status: "All" as string,
  });

  const router = useRouter();

  //  Lấy danh sách bài thi
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);

        const data = await BankService.fecthBank(query);

        setBank(data.banks);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [query]);

  //xoa
  const handleDelete = async (bank_id: number) => {
    try {
      await BankService.deleteBank(bank_id);
      setBank(prev => (
        prev.filter(b => b.bank_id !== bank_id)
      ));
    } catch (error) {
      console.error("Error deleting exam:", error);
    }
  };

  //chuyen trang thai
  const handleToggleAvailable = async (bank_id: number, available: boolean) => {
    try {
      await BankService.toggleExamAvailable(bank_id, available);

      setBank(prev =>
        prev.map(b =>
          b.bank_id === bank_id ? { ...b, available } : b
        )
      );
    } catch (error) {
      console.error("Error toggling exam availability:", error);
    }
  };

  const handleChngeSearch = (keyword: string) => {
    setQuery(prev => ({
      ...prev,
      page: 1,
      searchKeyword: keyword,
    }))
  }

  const handleChangeFilter = (filter: any) => {
    setQuery(prev => ({
      ...prev,
      page: 1,
      subject_id:
        filter.subject !== "All" ? filter.subject : undefined,
      topic_ids: filter.topic !== "All" ? filter.topic : undefined,
      status:
        filter.status !== "All" ? filter.status : undefined,
    }))
  }
  //xem chi tiet
  const detailBank = (id: number, bank: Bank) => {
    localStorage.setItem("bank", JSON.stringify(bank));
    router.push(`/admin/bank/detail/${id}`);
  };

  if (loading) return <p className={styles.loading}>Đang tải danh sách bài thi...</p>;


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>QUẢN LÝ LUYỆN TẬP</h1>

        <div className={styles.actions}>
          <div
            className={styles.button}
            onClick={() => router.push("/admin/bank/create")}>
            <button className={styles.addButton}>
              + Thêm bài luyện tập
            </button>
          </div>
          {/* filter search */}
          <div className={styles.filter_search}>
            <FilterExam
              value={filterUI}
              onApply={(filter) => {
                setFilterUI(filter)
                handleChangeFilter(filter)
              }}
            />
            <Search
              searchKeyword={query.searchKeyword}
              setSearchKeyword={handleChngeSearch}
              typeSearch="exam"
            />
          </div>
        </div>
        
      </div>
      {/* noi hien  bang*/}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên bài thi</th>
            <th>Thời gian (phút)</th>
            <th>Trạng thái</th>
            <th>Chủ đề</th>
            <th>Chỉnh sửa</th>
          </tr>
        </thead>
        <tbody>
          {bank?.length > 0 ? (
            bank?.map((bank, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className={styles.detailBtn}
                  onClick={() => detailBank(bank.bank_id, bank)}>{bank.description}</td>
                <td>{bank.time_limit}</td>
                <td
                  className={bank.available ? styles.active : styles.inactive}
                >
                  {bank.available ? "Hoạt động" : "Không hoạt động"}
                  {
                    <span
                      className={styles.editIcon}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleAvailable(bank.bank_id, !bank.available)
                      }
                      }
                    >
                      ✎
                    </span>
                  }
                </td>
                <td>{bank.topic_name}</td>
                <td>
                  <button
                    className={styles.delBtn}
                    onClick={() => handleDelete(bank.bank_id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className={styles.empty}>
                Không có bài thi phù hợp
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={query.page}
        setCurrentPage={(page: number) =>
          setQuery(prev => ({ ...prev, page }))
        }
      />
    </div>
  );
}
