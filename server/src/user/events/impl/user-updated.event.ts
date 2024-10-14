export class UserUpdatedEvent {
    constructor(
        public readonly userId: string,
        public readonly username: string,
    ) { }
}
