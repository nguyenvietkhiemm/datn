// utils/csv.ts
import Papa from "papaparse";

export interface CsvRow {
    [key: string]: string | number | boolean;
}

/**
 * Lấy CSV từ server và parse thành JSON
 * @param fileUrl url CSV trên server
 * @returns mảng object
 */
export async function fetchCsvContent(fileUrl: string): Promise<CsvRow[]> {
    try {
        const res = await fetch(fileUrl, {
            method: "GET",
            // nếu cần token:
            // headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Không tải được file CSV từ server");

        const csvText = await res.text();

        const result = Papa.parse<CsvRow>(csvText, {
            header: true,      // đọc header thành key object
            skipEmptyLines: true,
        });

        return result.data;
    } catch (error) {
        console.error("Lỗi fetchCsvContent:", error);
        throw error;
    }
}
