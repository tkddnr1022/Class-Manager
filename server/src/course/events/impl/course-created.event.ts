export class CourseCreatedEvent {
    constructor(
        public readonly courseId: string,
        public readonly title: string,
    ) { }
}
