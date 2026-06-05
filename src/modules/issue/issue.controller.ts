import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { IIssue } from "./issue.interface";

const createIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.createIssueIntoDb(req.body);
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssuesFromDb();
    res.status(200).json({
      success: true,
      message: "Issues retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const issueId = req.params.id;
  try {
    const result = await issueService.getSingleIssueFromDb(issueId as string);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Issue retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const issueId = req.params.id;
    const result = await issueService.updateIssueIntoDb(
      issueId as string,
      req.body as IIssue,
    );
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


const deleteIssue = async (req: Request, res: Response) => {
   const issueId = req.params.id;
  try {
    const result = await issueService.deleteIssueFromDb(issueId as string);
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
