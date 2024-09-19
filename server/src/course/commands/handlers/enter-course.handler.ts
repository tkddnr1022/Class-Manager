import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CourseService } from "src/course/course.service";
import { EnterCourseCommand } from "../impl/enter-course.command";
import { CourseEnteredEvent } from "src/course/events/impl/course-entered.event";

@CommandHandler(EnterCourseCommand)
export class EnterCourseHandler implements ICommandHandler<EnterCourseCommand>{
    constructor(
        private readonly courseService: CourseService,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: EnterCourseCommand): Promise<any> {
        const { courseId, userId, deviceId, location } = command;
        const courseData = await this.courseService.enterCourse({ courseId, userId, deviceId, location });
        this.eventBus.publish(new CourseEnteredEvent(courseId, userId));
        return courseData;
    }
}