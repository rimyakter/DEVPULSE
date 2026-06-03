import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    res.status(500).json({
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
      res.status(404).json({
        success: false,
        message: "User not Found!",
        data: {},
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User retrieved successfully!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.error("Error retrieving user:", error);
    res.status(500).json({
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
      res.status(404).json({
        success: false,
        message: "User not Found!",
        data: {},
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.error("Error updating user:", error);
    res.status(500).json({
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
      res.status(404).json({
        success: false,
        message: "User not Found!",
        data: {},
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully!",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    console.error("Error deleting user:", error);
    res.status(500).json({
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
