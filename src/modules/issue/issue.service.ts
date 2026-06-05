import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDb = async (payload: IIssue) => {
  const { title, description, type, reporter_id } = payload;
  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, status, reporter_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, "open", reporter_id],
  );
  return result;
};

const getAllIssuesFromDb = async () => {
  const result = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues`,
  );
  return result;
};

const getSingleIssueFromDb = async (issueId: string) => {
  const result = await pool.query(
    `SELECT id, title, description, type, status, reporter_id, created_at, updated_at FROM issues WHERE id = $1`,
    [issueId],
  );
  return result;
};

const updateIssueIntoDb = async (issueId: string, payload: IIssue) => {
  const { title, description, type, status } = payload;
  const result = await pool.query(
    `
      UPDATE issues
      SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        type = COALESCE($3, type),
        status = COALESCE($4, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, status, issueId],
  );
  return result;
};

const deleteIssueFromDb = async (issueId: string) => {
  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING id`,
    [issueId],
  );
  return result;
};

export const issueService = {
  createIssueIntoDb,
  getAllIssuesFromDb,
  getSingleIssueFromDb,
  updateIssueIntoDb,
  deleteIssueFromDb,
};
