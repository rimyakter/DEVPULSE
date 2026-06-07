import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User created successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users retrieved successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await userService.getSingleUserFromDB(userId as string);

    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not Found!",
        data: {},
      });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User retrieved successfully!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, password, role } = req.body;
    const result = await userService.updateUserInDB(userId as string, {
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
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.error("Error updating user:", error);
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await userService.deleteUserFromDB(userId as string);

    if (result.rows.length === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not Found!",
        data: {},
      });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User deleted successfully!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
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
