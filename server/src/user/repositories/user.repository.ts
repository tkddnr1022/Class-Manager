import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../models/user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

  async createUser(userData: User): Promise<any> {
    const newUser = new this.userModel(userData);
    return await newUser.save();
  }

  async findUserById(userId: Types.ObjectId): Promise<User | null> {
    return await this.userModel.findById(userId, { password: 0, verification: 0 }).exec();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findUserByStudentId(studentId: string): Promise<User | null> {
    return await this.userModel.findOne({ studentId }, { password: 0, verification: 0 }).exec();
  }

  async findUserByOId(oId: string): Promise<User | null> {
    return await this.userModel.findOne({ oId }, { password: 0, verification: 0 }).exec();
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userModel.find({}, { password: 0, verification: 0 }).exec();
  }

  async updateUser(userId: Types.ObjectId, updateData: Partial<User>): Promise<any | null> {
    return await this.userModel.findByIdAndUpdate(userId, updateData, { new: true, password: 0, verification: 0 }).exec();
  }

  async deleteUser(userId: Types.ObjectId): Promise<User | null> {
    return await this.userModel.findByIdAndDelete(userId, { password: 0, verification: 0 }).exec();
  }
}
