import { BadRequestException, Injectable } from '@nestjs/common';
import { CourseRepository } from './repositories/course.repository';
import { CreateCourseDto } from './dtos/create-course';
import { UpdateCourseDto } from './dtos/update-course';
import { EnterCourseDto } from './dtos/enter-course';
import { Types } from 'mongoose';
import * as haversine from 'haversine-distance';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CourseService {
    constructor( 
        private readonly courseRepository: CourseRepository,
        private readonly configService: ConfigService,
    ) {}

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
        // 수업 ID
        const course = await this.courseRepository.findCourseById(enterCourseDto.courseId);
        if(!course){
            throw new BadRequestException("ERROR_COURSE_ID");
        }
        const { startAt, endAt, location, students } = course;

        // 유저 ID
        const isUserIdExist = students?.some(student => student.student?._id == enterCourseDto.userId);
        if(isUserIdExist){
            throw new BadRequestException("ERROR_USER_ID");
        }
        
        // 현재 시간
        const currentTime = new Date();
        if(currentTime < startAt){
            throw new BadRequestException("ERROR_START_TIME");
        }
        if(currentTime > endAt){
            throw new BadRequestException("ERROR_END_TIME");
        }

        // 현재 위치
        const distance = haversine(enterCourseDto.location, location);
        const range = this.configService.get<number>('LOCATION_RANGE');
        if(distance > range){
            throw new BadRequestException("ERROR_LOCATION_RANGE");
        }

        // 디바이스 ID
        const isDeviceIdUsed = students?.some(student => student.deviceId == enterCourseDto.deviceId);
        if(isDeviceIdUsed){
            throw new BadRequestException("ERROR_DEVICE_ID");
        }

        return await this.courseRepository.addStudent(enterCourseDto.courseId, enterCourseDto.userId, enterCourseDto.deviceId);
    }
}
