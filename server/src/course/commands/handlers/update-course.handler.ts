import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CourseService } from "src/course/course.service";
import { UpdateCourseCommand } from "../impl/update-course.command";
import { CourseUpdatedEvent } from "src/course/events/impl/course-updated.event";

@CommandHandler(UpdateCourseCommand)
export class UpdateCourseHandler implements ICommandHandler<UpdateCourseCommand>{
    constructor(
        private readonly courseService: CourseService,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: UpdateCourseCommand): Promise<any> {
        const { courseId, title, startAt, endAt, location, students } = command;
        const courseData = await this.courseService.updateCourse(courseId, { title, startAt, endAt, location, students });
        this.eventBus.publish(new CourseUpdatedEvent(courseData._id.toString(), courseData.title));
        return courseData;
    }
}