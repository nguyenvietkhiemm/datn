import multer from "multer";
import path from "path";
import fs from "fs";

const csvDir = path.join(__dirname, "../../data/uploads/resources/csv_file");
const docDir = path.join(__dirname, "../../resources/docx_file");

[csvDir, docDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Storage CSV
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, csvDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

// Storage DOC/DOCX/PDF
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, docDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});

// Bộ lọc loại file
const csvFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (path.extname(file.originalname).toLowerCase() === ".csv") cb(null, true);
  else cb(new Error("Chỉ chấp nhận file CSV"));
};

const docFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowed = [".doc", ".docx", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Chỉ chấp nhận file DOC, DOCX hoặc PDF"));
};

// Export hai instance riêng
export const uploadCSV = multer({ storage: csvStorage, fileFilter: csvFilter });
export const uploadDOC = multer({ storage: docStorage, fileFilter: docFilter });
