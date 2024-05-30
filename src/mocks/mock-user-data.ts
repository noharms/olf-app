import { User } from "src/model/user";



export const MOCK_USERS: User[] = [
    new User(11, 'olf', 'system@olf.com', new Date()),
    new User(12, 'johndoe', 'john@example.com', new Date()),
    new User(13, 'janedoe', 'jane@example.com', new Date()),
    // Add more users as needed
];

export const PLAYER1: User = MOCK_USERS[0]
export const PLAYER2: User = MOCK_USERS[1]
export const PLAYER3: User = MOCK_USERS[2]
