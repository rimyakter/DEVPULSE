import { Router } from "express";
import { profileController } from "./profile.controller";
const router = Router();
router.post("/", profileController.createProfile);
export const profileRoute = router;
//# sourceMappingURL=profile.route.js.map