import { Router } from "express";
import { FileController } from "../controllers/file.controller";
import { uploadImage } from "../utils/upload";

const router = Router();

router.get("/json", FileController.getAllJson);
router.get("/json/:filename", FileController.getJsonById);
router.post(
    "/images/info",
    FileController.getImagesInfo
  );
  
  // stream ảnh (FE đọc được)
  router.get(
    "/images/:filename",
    FileController.streamImage
  );
  
  // upload ảnh (hash – không trùng)
  router.post(
    "/images/upload",
    uploadImage.single("image"),
    FileController.uploadImage
  );
export default router;
