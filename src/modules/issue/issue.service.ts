import { pool } from "../../db";
import type { IssueFilters } from "../../types";
import type { IIssue } from "./issue.interface";

const createIssueIntoDb = async (payload: IIssue) => {
  const { title, description, type, status, reporter_id } = payload;
  const result = await pool.query(
    `
      INSERT INTO issues (title, description, type, status, reporter_id)
      VALUES ($1, $2, $3, COALESCE($4, 'open'), $5)
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `,
    [title, description, type, status, reporter_id],
  );
  return result;
};

const getAllIssuesFromDb = async (filters: IssueFilters) => {
  const values: any[] = [];
  const whereClauses: string[] = [];

  let query = `
    SELECT 
      id,
      title,
      description,
      type,
      status,
      reporter_id,
      created_at,
      updated_at
    FROM issues
  `;

  if (filters.type) {
    values.push(filters.type);
    whereClauses.push(`type = $${values.length}`);
  }

  if (filters.status) {
    values.push(filters.status);
    whereClauses.push(`status = $${values.length}`);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ` + whereClauses.join(" AND ");
  }

  query +=
    filters.sort === "oldest"
      ? ` ORDER BY created_at ASC`
      : ` ORDER BY created_at DESC`;

  const issuesResult = await pool.query(query, values);
  const issues = issuesResult.rows;

  if (issues.length === 0) return issuesResult;

  //collect all unique reporter IDs
  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];

  //batch fetch users
  const usersResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds],
  );

  const userMap = new Map(usersResult.rows.map((u) => [u.id, u]));

  // attach reporter to each issue
  const enrichedIssues = issues.map(({ reporter_id, ...rest }) => ({
    ...rest,
    reporter: userMap.get(reporter_id) || null,
  }));

  return { rows: enrichedIssues };
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
