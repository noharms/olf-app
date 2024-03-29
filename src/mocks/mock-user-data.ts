import { User } from "src/model/user";



export const MOCK_USERS: User[] = [
    { id: 0, name: 'Olf', email: 'system@olf.com', registrationDate: new Date() },
    { id: 1, name: 'John Doe', email: 'john@example.com', registrationDate: new Date() },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', registrationDate: new Date() },
    // Add more users as needed
];


export const COMPUTER_PLAYER: User = MOCK_USERS[0];

export const PLAYER1: User = MOCK_USERS[1]
