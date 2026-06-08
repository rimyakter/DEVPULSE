import { authService } from "./auth.service";
const signupUser = async (req, res) => {
    try {
        const result = await authService.signupUserIntoDb(req.body);
        console.log(result);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
};
const loginUser = async (req, res) => {
    try {
        const result = await authService.loginUserIntoDb(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token: result.token,
                user: result.user,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
};
export const authController = {
    loginUser,
    signupUser,
};
//# sourceMappingURL=auth.controller.js.map