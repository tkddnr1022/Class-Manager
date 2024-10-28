import { Verification } from "src/auth/interfaces/verification.interface";

export class UpdateUserCommand {
    constructor(
        public readonly userId: string,
        public readonly username?: string,
        public readonly email?: string,
        public readonly password?: string,
        public readonly studentId?: string,
        public readonly verified?: boolean,
        public readonly verification?: Verification,
    ) { }
}