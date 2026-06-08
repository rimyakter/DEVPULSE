import type { IUser } from "./user.interface";
export declare const userService: {
    createUserIntoDB: (payload: IUser) => Promise<import("pg").QueryResult<any>>;
    getAllUsersFromDB: () => Promise<import("pg").QueryResult<any>>;
    getSingleUserFromDB: (userId: string) => Promise<import("pg").QueryResult<any>>;
    updateUserInDB: (userId: string, payload: Partial<IUser>) => Promise<import("pg").QueryResult<any>>;
    deleteUserFromDB: (userId: string) => Promise<import("pg").QueryResult<any>>;
};
//# sourceMappingURL=user.service.d.ts.map