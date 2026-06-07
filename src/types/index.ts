export const UserRole = {
  maintainer: "maintainer",
  contributor: "contributor",
} as const;

export type IssueFilters = {
  sort?: string;
  type?: string;
  status?: string;
};

export type UserRoleType = "maintainer" | "contributor";
