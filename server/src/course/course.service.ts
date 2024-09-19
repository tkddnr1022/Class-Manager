import { Injectable } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';
import { CreateCourseDto } from './dtos/create-course';
import { UpdateCourseDto } from './dtos/update-course';
import { EnterCourseDto } from './dtos/enter-course';
import { Types } from 'mongoose';

@Injectable()
export class CourseService {
    constructor( private readonly courseRepository: CourseRepository) {}

    async createCourse(createCourseDto: CreateCourseDto){
        return await this.courseRepository.createCourse(createCourseDto);
    }

    async getCourseById(courseId: Types.ObjectId){
        return await this.courseRepository.findCourseById(courseId);
    }

    async getCourseByUser(userId: Types.ObjectId){
        return await this.courseRepository.findCourseByUser(userId);
    }

    async getCourseByTitle(title: string){
        return await this.courseRepository.findCourseByTitle(title);
    }

    async listCourses(){
        return await this.courseRepository.findAllCourses();
    }

    async updateCourse(courseId: Types.ObjectId, updateCourseDto: UpdateCourseDto){
        return await this.courseRepository.updateCourse(courseId, updateCourseDto);
    }

    async deleteCourse(courseId: Types.ObjectId){
        return await this.courseRepository.deleteCourse(courseId);
    }

    async enterCourse(enterCourseDto: EnterCourseDto){
        // Todo: 시간, 위치, 디바이스 ID 검증 로직 작성
        return await this.courseRepository.addStudent(enterCourseDto.courseId, enterCourseDto.userId, enterCourseDto.deviceId);
    }
}
