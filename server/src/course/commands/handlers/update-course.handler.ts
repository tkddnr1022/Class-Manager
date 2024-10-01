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
        const courseData = await this.courseService.updateCourse(command);
        this.eventBus.publish(new CourseUpdatedEvent(courseData._id, courseData.title));
        return courseData;
    }
}