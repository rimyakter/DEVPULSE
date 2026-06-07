import { Router } from "express";
import { issueController } from "./issue.controller";
import { UserRole } from "../../types";
import auth from "../../middleware/auth";

const router = Router();
router.post(
  "/",
  auth(UserRole.maintainer, UserRole.contributor),
  issueController.createIssue,
);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getSingleIssue);
router.put("/:id",auth(UserRole.maintainer, UserRole.contributor), issueController.updateIssue);
router.delete("/:id", auth(UserRole.maintainer), issueController.deleteIssue);

export const issueRoute = router;
