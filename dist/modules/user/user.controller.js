import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";
const createUser = async (req, res) => {
    try {
        const result = await userService.createUserIntoDB(req.body);
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User created successfully!",
            data: result.rows[0],
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsersFromDB();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Users retrieved successfully!",
            data: result.rows,
        });
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};
const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await userService.getSingleUserFromDB(userId);
        if (result.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User not Found!",
                data: {},
            });
        }
        else {
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: "User retrieved successfully!",
                data: result.rows[0],
            });
        }
    }
    catch (error) {
        console.error("Error retrieving user:", error);
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, password, role } = req.body;
        const result = await userService.updateUserInDB(userId, {
            name,
            password,
            role,
        });
        if (result.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User not Found!",
                data: {},
            });
        }
        else {
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: "User updated successfully!",
                data: result.rows[0],
            });
        }
    }
    catch (error) {
        console.error("Error updating user:", error);
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await userService.deleteUserFromDB(userId);
        if (result.rows.length === 0) {
            sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "User not Found!",
                data: {},
            });
        }
        else {
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: "User deleted successfully!",
                data: result.rows[0],
            });
        }
    }
    catch (error) {
        console.error("Error deleting user:", error);
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error,
        });
    }
};
export const userController = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
};
//# sourceMappingURL=user.controller.js.map