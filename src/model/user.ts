
export class User {

    constructor(
        private _id: number,
        private _name: string,
        private _email: string,
        private _registrationDate: Date
    ) { }

    public get registrationDate(): Date {
        return this._registrationDate;
    }
    public get email(): string {
        return this._email;
    }
    public get id(): number {
        return this._id;
    }
    public get name(): string {
        return this._name;
    }

    toString(): string {
        return this.name;
    }
}

export const EMPTY_USER: User = new User(
    -1,
    "-",
    "-",
    new Date()
);