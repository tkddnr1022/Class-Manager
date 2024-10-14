export class CourseUpdatedEvent {
    constructor(
        public readonly courseId: string,
        public readonly title: string,
    ) { }
}
