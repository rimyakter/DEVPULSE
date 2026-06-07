import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import type { IIssue } from "./issue.interface";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  try {
    const reporter_id = req.user?.id;
    if (!reporter_id) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
      });
    }
    const result = await issueService.createIssueIntoDb({
      ...req.body,
      reporter_id,
    } as IIssue);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
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

const getAllIssues = async (req: Request, res: Response) => {
  try {
    const { sort, type, status } = req.query;

    const result = await issueService.getAllIssuesFromDb({
      sort: sort as string,
      type: type as string,
      status: status as string,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error,
    });
  }
};

const getSingleIssue = async (req: Request, res: Response) => {
  const issueId = req.params.id;

  try {
    const issue = await issueService.getSingleIssueFromDb(issueId as string);

    if (!issue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
        data: {},
      });
    }

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: issue,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error,
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
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
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

const deleteIssue = async (req: Request, res: Response) => {
  const issueId = req.params.id;
  try {
    const result = await issueService.deleteIssueFromDb(issueId as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
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

export const issueController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
