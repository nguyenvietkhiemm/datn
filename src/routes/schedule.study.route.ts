import { Router } from "express";
import StudyScheduleController from "../controllers/schedule.study.controller"

const scheduleStudyRouter = Router();

scheduleStudyRouter.get("/", StudyScheduleController.getAll);
scheduleStudyRouter.get("/:id", StudyScheduleController.getById);
scheduleStudyRouter.post("/create", StudyScheduleController.create);
scheduleStudyRouter.put("/:id", StudyScheduleController.update);
scheduleStudyRouter.delete("/:id", StudyScheduleController.delete);

export default scheduleStudyRouter;
