import { FileController } from "../controllers/file.controller";
import Authentication from "../middleware/authentication";
import { ADMIN } from "../config/permission";
import { uploadCSV, uploadDOC } from '../utils/upload';
import { Router } from "express";

const fileRouter = Router();

// JSON FILE HANDLERS

fileRouter.get("/json",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    FileController.getAllJson);

fileRouter.get(
    "/json/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    FileController.getJsonById
);

// chưa sửa
// fileRouter.post("/json/save/:filename",
//     Authentication.AuthenticateToken,
//     Authentication.AuthorizeRoles(...ADMIN),
//     uploadCSV.single("file"),
//     FileController.saveCsv
// );

// DOCX FILE HANDLERS

fileRouter.post("/docx/save/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    uploadDOC.single("file"),
    FileController.saveDocx
);

// IMAGE FILE HANDLERS

fileRouter.post(
    "/images",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    FileController.getImagesById
);

export default fileRouter;
