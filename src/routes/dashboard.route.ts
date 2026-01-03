import { Router } from "express";
import Authentication from "../middleware/authentication";
import { ADMIN } from "../config/permission";
import { DashboardController } from "../controllers/dashboard.controller";

const dashBoardRoute = Router();

dashBoardRoute.get('/',
    Authentication.AuthenticateToken,
    Authentication.AuthorizeRoles(...ADMIN),
    DashboardController.getDashboardStats
)

export default dashBoardRoute

