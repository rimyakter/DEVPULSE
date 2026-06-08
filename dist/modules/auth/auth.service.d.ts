import type { IUser } from "./auth.interface";
export declare const authService: {
    loginUserIntoDb: (payload: {
        email: string;
        password: string;
    }) => Promise<{
        token: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            created_at: any;
            updated_at: any;
        };
    }>;
    signupUserIntoDb: (payload: IUser) => Promise<any>;
};
//# sourceMappingURL=auth.service.d.ts.map