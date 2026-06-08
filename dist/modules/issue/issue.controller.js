import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";
const createIssue = async (req, res) => {
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
        });
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
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
const getAllIssues = async (req, res) => {
    try {
        const { sort, type, status } = req.query;
        const result = await issueService.getAllIssuesFromDb({
            sort: sort,
            type: type,
            status: status,
        });
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issues retrieved successfully",
            data: result.rows,
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error,
        });
    }
};
const getSingleIssue = async (req, res) => {
    const issueId = req.params.id;
    try {
        const issue = await issueService.getSingleIssueFromDb(issueId);
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
    }
    catch (error) {
        return sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error,
        });
    }
};
const updateIssue = async (req, res) => {
    try {
        const issueId = req.params.id;
        const result = await issueService.updateIssueIntoDb(issueId, req.body, req.user);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue updated successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        sendResponse(res, {
            statusCode: error.statusCode || 500,
            success: false,
            message: error.message,
            error,
        });
    }
};
const deleteIssue = async (req, res) => {
    const issueId = req.params.id;
    try {
        const result = await issueService.deleteIssueFromDb(issueId);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Issue deleted successfully",
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
export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue,
};
//# sourceMappingURL=issue.controller.js.map