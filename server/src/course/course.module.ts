import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CreateCourseHandler } from './commands/handlers/create-course.handler';
import { UpdateCourseHandler } from './commands/handlers/update-course.handler';
import { GetCourseHandler } from './queries/handlers/get-course.handler';
import { GetCourseByUserHandler } from './queries/handlers/get-course-by-user.handler';
import { GetCourseByTitleHandler } from './queries/handlers/get-course-by-title.handler';
import { ListCoursesHandler } from './queries/handlers/list-courses.handler';
import { CourseCreatedHandler } from './events/handlers/course-created.handler';
import { CourseUpdatedHandler } from './events/handlers/course-updated.handler';
import { CourseRepository } from './repositories/course.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './models/course.model';
import { DeleteCourseHandler } from './commands/handlers/delete-course-handler';
import { CourseDeletedHandler } from './events/handlers/course-deleted.handler';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
  ],
  providers: [
    CourseService,
    CourseRepository,
    CreateCourseHandler,
    UpdateCourseHandler,
    GetCourseHandler,
    GetCourseByUserHandler,
    GetCourseByTitleHandler,
    ListCoursesHandler,
    CourseCreatedHandler,
    CourseUpdatedHandler,
    DeleteCourseHandler,
    CourseDeletedHandler,
  ],
  controllers: [CourseController]
})
export class CourseModule {}
