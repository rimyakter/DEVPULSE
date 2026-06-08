import type { IssueFilters } from "../../types";
import type { IIssue } from "./issue.interface";
export declare const issueService: {
    createIssueIntoDb: (payload: IIssue) => Promise<import("pg").QueryResult<any>>;
    getAllIssuesFromDb: (filters: IssueFilters) => Promise<import("pg").QueryResult<any> | {
        rows: {
            id: any;
            title: any;
            description: any;
            type: any;
            status: any;
            reporter: any;
            created_at: any;
            updated_at: any;
        }[];
    }>;
    getSingleIssueFromDb: (issueId: string) => Promise<{
        id: any;
        title: any;
        description: any;
        type: any;
        status: any;
        reporter: any;
        created_at: any;
        updated_at: any;
    } | null>;
    updateIssueIntoDb: (issueId: string, payload: IIssue, user: {
        id: string;
        role: string;
    }) => Promise<import("pg").QueryResult<any>>;
    deleteIssueFromDb: (issueId: string) => Promise<import("pg").QueryResult<any>>;
};
//# sourceMappingURL=issue.service.d.ts.map