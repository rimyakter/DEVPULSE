import express, {} from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { issueRoute } from "./modules/issue/issue.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler";
const app = express();
app.use(express.json());
app.use(logger);
app.use(cors({
    origin: "http://localhost:3000",
}));
app.get("/api", (req, res) => {
    res.status(200).json({
        message: "Hello World!",
        author: "Devpulse",
    });
});
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/issues", issueRoute);
app.use("/api/auth", authRoute);
// Global Error Handling Middleware
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map