import { CsvController } from "../controllers/csv.controller";
import Authentication from "../middleware/authentication";
import { ADMIN } from "../config/permission";
import { Router } from "express";

const csvRouter = Router();

// GET /documents/csv-list
csvRouter.get("/",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    CsvController.getAll);

csvRouter.get(
    "/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    CsvController.getById
);

csvRouter.post("/save/:filename",
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    CsvController.saveCsv
)

export default csvRouter;
