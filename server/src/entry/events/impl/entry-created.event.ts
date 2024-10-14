export class EntryCreatedEvent {
    constructor(
        public readonly userId: string,
        public readonly courseId: string,
    ) { }
}
