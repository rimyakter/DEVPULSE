import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { UserRole } from "../../types";

const router = Router();



router.post("/", userController.createUser);
router.get("/", auth(UserRole.maintainer), userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
