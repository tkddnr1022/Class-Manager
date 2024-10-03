import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async createUser(userData: User): Promise<any> {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }

  async findUserById(userId: Types.ObjectId): Promise<User | null> {
    return await this.userModel.findById(userId).exec();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findUserByStudentId(studentId: string): Promise<User | null> {
    return await this.userModel.findOne({ studentId }).exec();
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async updateUser(userId: Types.ObjectId, updateData: Partial<User>): Promise<any | null> {
    return await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  async deleteUser(userId: Types.ObjectId): Promise<User | null> {
    return await this.userModel.findByIdAndDelete(userId).exec();
  }
}