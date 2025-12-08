import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export interface FileInfo {
    id: number;
    name: string;
    url: string;
}

export function getJsonFilesList(baseUrl: string): FileInfo[] {
    // const csvDir = path.join(__dirname, "../../data/uploads/csv");
    const csvDir = path.join(__dirname, "../../data/outputs");

    console.log("Đường dẫn thư mục CSV:", csvDir);

    if (!fs.existsSync(csvDir)) {
        console.warn(" Thư mục uploads/csv chưa tồn tại, tạo mới...");
        fs.mkdirSync(csvDir, { recursive: true });
    }

    const files = fs.readdirSync(csvDir).filter(
    (f) => f.endsWith(".json")
    );


    return files.map((file, index) => ({
        id: index + 1,
        name: file,
        // url: `${baseUrl}/data/uploads/csv/${file}`,
        url: `${baseUrl}/data/outputs/${file}`,
    }));
}

export function getJsonById(filename: string): any {
    const jsonDir = path.join(__dirname, "../../data/outputs");
    if (!fs.existsSync(jsonDir)) { 
        throw new Error("Thư mục JSON không tồn tại"); 
    }

    const filePath = path.join(jsonDir, filename);
    if (!fs.existsSync(filePath)) { 
        throw new Error("File không tồn tại"); 
    }

    const jsonText = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonText);
}


function getMime(file: string) {
    const ext = path.extname(file).toLowerCase();
    if (ext === ".png") return "image/png";
    if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
    if (ext === ".gif") return "image/gif";
    return "application/octet-stream";
}

export function getImagesById(filenames: string[]) {
    const mediaDir = path.join(__dirname, "../../data/outputs/media");

    if (!fs.existsSync(mediaDir)) {
        throw new Error("Thư mục MEDIA không tồn tại");
    }

    const results = [];

    for (const filename of filenames) {
        const filePath = path.join(mediaDir, filename);

        if (!fs.existsSync(filePath)) {
            console.warn(`⚠ File không tồn tại: ${filename}`);
            continue; // skip file missing
        }

        const buffer = fs.readFileSync(filePath);
        const base64 = buffer.toString("base64");

        results.push({
            filename,
            mime: getMime(filename),
            data: base64,
        });
    }

    return results;
}