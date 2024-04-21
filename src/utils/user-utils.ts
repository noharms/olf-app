import { User } from "src/model/user";

export function concatUsers(users: User[]): string {
    return users.map(u => u.name).join(", ")
}