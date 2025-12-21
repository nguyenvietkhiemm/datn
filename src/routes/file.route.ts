import { Router } from "express";
import { FileController } from "../controllers/file.controller";
import { uploadImage } from "../utils/upload";
import Authentication from "../middleware/authentication";
import { uploadDOC } from '../utils/upload';
import { ADMIN } from "../config/permission";


const router = Router();

router.get("/json", FileController.getAllJson);
router.get("/json/:filename", FileController.getJsonById);
router.post(
  "/images/info",
  FileController.getImagesInfo
);

// stream ảnh (FE đọc được)
router.get(
  "/images/signed/:filename",
  Authentication.AuthenticateToken,
  FileController.getSignedImageUrl
);

router.get(
  "/images/:filename",
  FileController.verifyImageSignature,
  FileController.streamImage
);

// upload ảnh (hash – không trùng)
router.post(
  "/images/upload",
  uploadImage.single("image"),
  FileController.uploadImage
);

router.post("/docx/save/:filename",
  Authentication.AuthenticateToken,
  Authentication.AuthorizeRoles(...ADMIN),
  uploadDOC.single("file"),
  FileController.saveDocx
);

export default router;
