import { User } from "src/model/user";



export const MOCK_USERS: User[] = [
    { id: 0, name: 'olf', email: 'system@olf.com', registrationDate: new Date() },
    { id: 1, name: 'johndoe', email: 'john@example.com', registrationDate: new Date() },
    { id: 2, name: 'janedoe', email: 'jane@example.com', registrationDate: new Date() },
    // Add more users as needed
];


export const COMPUTER_PLAYER: User = MOCK_USERS[0];

export const PLAYER1: User = MOCK_USERS[1]
