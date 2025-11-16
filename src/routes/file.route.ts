import { FileController } from "../controllers/file.controller";
import Authentication from "../middleware/authentication";
import { ADMIN } from "../config/permission";
import { Router } from "express";

const fileRouter = Router();

// GET /documents/csv-list
fileRouter.get("/csv",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    FileController.getAll);

fileRouter.get(
    "/csv/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    FileController.getById
);

fileRouter.post("/csv/save/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    FileController.saveCsv
)

export default fileRouter;
