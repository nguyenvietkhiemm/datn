import { JsonAnswer, JsonQuestion } from "./type";
import {  API_URL, getHeaders } from "@/lib/service";
import { FileParserModel } from "./model";

export const FileParserService = {
    // Hàm trích xuất các hình ảnh từ câu hỏi

    async getStoredChanges(name: string) {
        try {
            const saved = localStorage.getItem(`json_diff_${name}`);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    },

    async loadJson(name: string, token?: string) {
        const url = `${API_URL}/file/json/${name}`;
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await res.json();
        return result.data || [];
    },

    async loadImages(jsonData: JsonQuestion[], token?: string) {
        const filenames = FileParserModel.collectImageNames(jsonData);

        if (filenames.length === 0) return {};

        const url = `${API_URL}/file/images`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ filesname: filenames }),
        });

        const result = await res.json();

        // result.data = { filename, mime, data }
        const mapped: Record<string, string> = {};
        result.data.forEach((file: any) => {
            mapped[file.filename] = `data:${file.mime};base64,${file.data}`;
        });

        return mapped;
    },

    async saveJson(name: string, jsonData: JsonQuestion[], token?: string) {
        const url = `${API_URL}/json/save/${name}`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(jsonData),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || result.error);
        return result;
    },
};
