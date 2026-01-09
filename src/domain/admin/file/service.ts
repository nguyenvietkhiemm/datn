
import { FileInfo } from "./type";
import { API_URL, getHeaders, getToken } from "@/lib/service";;

export const FileService = {
        async fetchFileList(fileUrl: string): Promise<FileInfo[]> {
                const token = getToken();
                if (!token) throw new Error("Token không tồn tại");

                const res = await fetch(fileUrl, {
                        method: "GET",
                        headers: getHeaders(token),
                });

                if (!res.ok) {
                        const errorText = await res.text(); // đọc nội dung lỗi từ server
                        throw new Error(`Không tải được list file từ server: ${errorText}`);
                }

                const fileList = await res.json();
                return fileList.data as FileInfo[];
        },

        async uploadFile(uploadUrl: string, file: File): Promise<any> {
                const formData = new FormData();
                formData.append("file", file);
                const token = getToken();
                console.log("HED:", getHeaders(token, false));
                const res = await fetch(uploadUrl, {
                        method: "POST",
                        body: formData,
                        headers: getHeaders(token, false)

                });

                if (!res.ok) throw new Error("Upload File thất bại hehehe");

                const data = await res.json();
                return data;
        }
}