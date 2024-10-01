import { UpdateCourseCommand } from './commands/impl/update-course.command';
import { Injectable } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CreateCourseCommand } from './commands/impl/create-course.command';

@Injectable()
export class CourseService {
    constructor(
        private readonly courseRepository: CourseRepository,
    ) { }

    async createCourse(createCourseCommand: CreateCourseCommand) {
        return await this.courseRepository.createCourse(createCourseCommand);
    }

    async getCourseById(courseId: Types.ObjectId) {
        return await this.courseRepository.findCourseById(courseId);
    }

    async getCourseByUser(userId: Types.ObjectId) {
        return await this.courseRepository.findCourseByUser(userId);
    }

    async getCourseByTitle(title: string) {
        return await this.courseRepository.findCourseByTitle(title);
    }

    async listCourses() {
        return await this.courseRepository.findAllCourses();
    }

    async updateCourse(updateCourseCommand: UpdateCourseCommand) {
        const { courseId, title, startAt, endAt, location } = updateCourseCommand;
        return await this.courseRepository.updateCourse(courseId, { title, startAt, endAt, location });
    }

    async deleteCourse(courseId: Types.ObjectId) {
        return await this.courseRepository.deleteCourse(courseId);
    }
}
