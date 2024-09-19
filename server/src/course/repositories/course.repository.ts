import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Course } from '../models/course.model';

@Injectable()
export class CourseRepository {
  constructor(
    @InjectModel('Course') private readonly courseModel: Model<Course>,
  ) { }

  async createCourse(courseData: Course): Promise<any> {
    const newCourse = new this.courseModel(courseData);
    return await newCourse.save();
  }

  async findCourseById(courseId: Types.ObjectId): Promise<Course | null> {
    return await this.courseModel.findById(courseId)
      .populate('students.student', 'username studentId')
      .populate('createdBy', 'username')
      .exec();
  }

  async findCourseByUser(userId: Types.ObjectId): Promise<Course | null> {
    return await this.courseModel.findOne({ createdBy: userId })
      .populate('students.student', 'username studentId')
      .populate('createdBy', 'username')
      .exec();
  }

  async findCourseByTitle(title: string): Promise<Course[] | null> {
    return await this.courseModel.find({ title: new RegExp(title, 'i') })
      .populate('students.student', 'username studentId')
      .populate('createdBy', 'username')
      .exec();
  }

  async findAllCourses(): Promise<Course[]> {
    return await this.courseModel.find()
      .populate('students.student', 'username studentId')
      .populate('createdBy', 'username')
      .exec();
  }

  async updateCourse(courseId: Types.ObjectId, updateData: Partial<Course>): Promise<any | null> {
    return await this.courseModel.findByIdAndUpdate(courseId, updateData, { new: true })
      .populate('students.student', 'username studentId')
      .populate('createdBy', 'username')
      .exec();
  }

  async deleteCourse(courseId: Types.ObjectId): Promise<Course | null> {
    return await this.courseModel.findByIdAndDelete(courseId)
      .populate('students.student', 'username studentId')
      .populate('createdBy', 'username')
      .exec();
  }

  async addStudent(courseId: Types.ObjectId, userId: Types.ObjectId, deviceId: string): Promise<any | null> {
    const course = await this.courseModel.findById(courseId);
    const entry = {
      student: userId,
      joinedAt: new Date(),
      deviceId: deviceId
    };
    course.students.push(entry);

    return await course.save();
  }
}
