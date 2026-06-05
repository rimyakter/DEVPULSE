import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { issueRoute } from "./modules/issue/issue.route";
const app: Application = express();
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World!",
    author: "Devpulse",
  });
});


app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/issues", issueRoute);

export default app;
