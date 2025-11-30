import { FileController } from "../controllers/file.controller";
import Authentication from "../middleware/authentication";
import { ADMIN } from "../config/permission";
import { uploadCSV, uploadDOC } from '../utils/upload';
import { Router } from "express";

const fileRouter = Router();

// GET /documents/csv-list
fileRouter.get("/csv",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    FileController.getAllCsv);

fileRouter.get(
    "/csv/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    FileController.getCsvById
);

fileRouter.post("/csv/save/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    uploadCSV.single("file"),
    FileController.saveCsv
);

// GET /documents/json-list
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

fileRouter.post("/json/save/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    uploadCSV.single("file"),
    FileController.saveCsv
);

fileRouter.post("/docx/save/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    uploadDOC.single("file"),
    FileController.saveDocx
);

export default fileRouter;
