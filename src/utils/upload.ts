import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

/* =========================
 * PATH CONFIG
 * ========================= */
const docDataDir     = path.join(__dirname, "../../data/uploads/docx");
const imageOutputDir = path.join(__dirname, "../../data/outputs/media");
const docDirResource = path.join(__dirname, "../../resources/docx_file");
const pdfDirResource = path.join(__dirname, "../../resources/pdf_file");

/* =========================
 * INIT FOLDERS
 * ========================= */
[docDataDir, docDirResource, pdfDirResource, imageOutputDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/* =========================
 * DOC STORAGE
 * ========================= */
const docStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, docDataDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

/* =========================
 * DOC RESOURCE STORAGE
 * ========================= */
export const docResourceStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext === ".pdf") {
      return cb(null, pdfDirResource);
    }

    // mặc định docx
    cb(null, docDirResource);
  },

  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

/* =========================
 * FILE FILTERS
 * ========================= */
const docFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExt = [".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file DOC hoặc DOCX"));
  }
};

const docResourceFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExt = [".docx", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file DOCX hoặc PDF"));
  }
};

/* =========================
 * IMAGE UPLOAD (DEDUP BY HASH)
 * ========================= */
const imageStorage = multer.memoryStorage();

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: (_req, file, cb) => {
    const hash = crypto
      .createHash("md5")
      .update(file.buffer)
      .digest("hex");

    const ext = path.extname(file.originalname);
    const fileName = `${hash}${ext}`;
    const filePath = path.join(imageOutputDir, fileName);

    // File đã tồn tại → bỏ qua
    if (fs.existsSync(filePath)) {
      return cb(null, false);
    }

    // Gắn tên file hash để xử lý sau
    (file as any).hashName = fileName;
    cb(null, true);
  },
});

/* =========================
 * EXPORT UPLOADERS
 * ========================= */
export const uploadDOC = multer({
  storage: docStorage,
  fileFilter: docFilter,
});

export const uploadDOCResource = multer({
  storage: docResourceStorage,
  fileFilter: docResourceFilter,
});


