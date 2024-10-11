import { DeleteCourseCommand } from './commands/impl/delete-course.command';
import { UpdateCourseCommand } from './commands/impl/update-course.command';
import { Injectable } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';
import { Types } from 'mongoose';
import { CreateCourseCommand } from './commands/impl/create-course.command';

@Injectable()
export class CourseService {
    constructor(
        private readonly courseRepository: CourseRepository,
    ) { }

    async createCourse(createCourseCommand: CreateCourseCommand) {
        const createdByObjectId = new Types.ObjectId(createCourseCommand.createdBy);
        return await this.courseRepository.createCourse({...createCourseCommand, createdBy: createdByObjectId});
    }

    async getCourseById(courseId: string) {
        const courseObjectId = new Types.ObjectId(courseId);
        return await this.courseRepository.findCourseById(courseObjectId);
    }

    async getCourseByUser(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        return await this.courseRepository.findCourseByUser(userObjectId);
    }

    async getCourseByTitle(title: string) {
        return await this.courseRepository.findCourseByTitle(title);
    }

    async listCourses() {
        return await this.courseRepository.findAllCourses();
    }

    async updateCourse(updateCourseCommand: UpdateCourseCommand) {
        const { courseId, title, startAt, endAt, location } = updateCourseCommand;
        const courseObjectId = new Types.ObjectId(courseId);
        return await this.courseRepository.updateCourse(courseObjectId, { title, startAt, endAt, location });
    }

    async deleteCourse(deleteCourseCommand: DeleteCourseCommand) {
        const courseObjectId = new Types.ObjectId(deleteCourseCommand.courseId);
        return await this.courseRepository.deleteCourse(courseObjectId);
    }
}
