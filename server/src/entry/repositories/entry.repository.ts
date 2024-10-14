import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Entry } from '../models/entry.model';
import EntryFilter from '../interfaces/entry-filter.interface';

@Injectable()
export class EntryRepository {
  constructor(
    @InjectModel('Entry') private readonly entryModel: Model<Entry>,
  ) { }

  async createEntry(entryData: Entry): Promise<any> {
    const newEntry = new this.entryModel(entryData);
    return await newEntry.save();
  }

  async findEntryById(entryId: Types.ObjectId): Promise<Entry | null> {
    return await this.entryModel.findById(entryId).populate('courseId', 'title createdBy').populate('userId', 'username studentId').exec();
  }

  async findEntryByUserId(userId: Types.ObjectId): Promise<Entry[] | null> {
    return await this.entryModel.find({ userId }).populate('courseId', 'title createdBy').populate('userId', 'username studentId').exec();
  }

  async findEntryByCourseId(courseId: Types.ObjectId): Promise<Entry[] | null> {
    return await this.entryModel.find({ courseId }).populate('courseId', 'title createdBy').populate('userId', 'username studentId').exec();
  }

  async findEntryByFilter(filter: any): Promise<Entry[] | null> {
    return await this.entryModel.find(filter).populate('courseId', 'title createdBy').populate('userId', 'username studentId').exec();
  }

  async findAllEntries(): Promise<Entry[]> {
    return await this.entryModel.find().populate('courseId', 'title createdBy').populate('userId', 'username studentId').exec();
  }

  async updateEntry(entryId: Types.ObjectId, updateData: Partial<Entry>): Promise<any | null> {
    return await this.entryModel.findByIdAndUpdate(entryId, updateData, { new: true }).populate('courseId', 'title createdBy').populate('userId', 'username studentId').exec();
  }

  async deleteEntry(entryId: Types.ObjectId): Promise<Entry | null> {
    return await this.entryModel.findByIdAndDelete(entryId).exec();
  }
}
