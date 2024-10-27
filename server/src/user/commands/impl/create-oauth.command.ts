export class CreateOAuthCommand {
    constructor(
        public readonly oId: string,
        public readonly email: string,
        public readonly auth: string,
    ) { }
}