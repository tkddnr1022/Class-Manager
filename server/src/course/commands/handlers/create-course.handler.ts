import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateCourseCommand } from "../impl/create-course.command";
import { CourseService } from "src/course/course.service";
import { CourseCreatedEvent } from "src/course/events/impl/course-created.event";

@CommandHandler(CreateCourseCommand)
export class CreateCourseHandler implements ICommandHandler<CreateCourseCommand>{
    constructor(
        private readonly courseService: CourseService,
        private readonly eventBus: EventBus,
    ) {}

    async execute(command: CreateCourseCommand): Promise<any> {
        const courseData = await this.courseService.createCourse(command);
        this.eventBus.publish(new CourseCreatedEvent(courseData._id.toString(), courseData.title));
        return courseData;
    }
}