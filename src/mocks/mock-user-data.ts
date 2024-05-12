import { User } from "src/model/user";



export const MOCK_USERS: User[] = [
    new User(0, 'olf', 'system@olf.com', new Date()),
    new User(1, 'johndoe', 'john@example.com', new Date()),
    new User(2, 'janedoe', 'jane@example.com', new Date()),
    // Add more users as needed
];


export const COMPUTER_PLAYER: User = MOCK_USERS[0];

export const PLAYER1: User = MOCK_USERS[1]
