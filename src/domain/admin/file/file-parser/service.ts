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
            headers: getHeaders(token)
        });
        const result = await res.json();
        return result.data || [];
    },


    getImageUrl (filename: string) {return `${API_URL}/file/images/${filename}`;},

    async saveJson(name: string, jsonData: JsonQuestion[], token?: string) {
        const url = `${API_URL}/json/save/${name}`;
        const res = await fetch(url, {
            method: "POST",
            headers: getHeaders(token),
            body: JSON.stringify(jsonData),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || result.error);
        return result;
    },
};
