

export interface User {
    id: number;
    name: string;
    email: string;
    registrationDate: Date
    // Additional properties can be added here as needed, such as:
    // username: string;
    // password: string; // Note: Storing passwords on the client-side is generally unsafe.
    // roles: string[]; // For role-based access control (RBAC).
    // isActive: boolean; // To indicate if the user account is active.
    // createdAt: Date; // To track when the account was created.
    // updatedAt: Date; // To track when the account was last updated.
}

export const EMPTY_USER: User = {
    id: -1,
    name: "-",
    email: "-",
    registrationDate: new Date()
}