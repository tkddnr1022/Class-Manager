export class CourseDeletedEvent {
    constructor(
        public readonly courseId: string,
        public readonly title: string,
    ) { }
}
