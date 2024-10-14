import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CourseService } from "src/course/course.service";
import { DeleteCourseCommand } from "../impl/delete-course.command";
import { CourseDeletedEvent } from "src/course/events/impl/course-deleted.event";

@CommandHandler(DeleteCourseCommand)
export class DeleteCourseHandler implements ICommandHandler<DeleteCourseCommand>{
    constructor(
        private readonly courseService: CourseService,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: DeleteCourseCommand): Promise<any> {
        const courseData = await this.courseService.deleteCourse(command);
        this.eventBus.publish(new CourseDeletedEvent(command.courseId, courseData.title));
        return courseData;
    }
}