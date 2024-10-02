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
    return await this.entryModel.findById(entryId).exec();
  }

  async findEntryByUserId(userId: Types.ObjectId): Promise<Entry[] | null> {
    return await this.entryModel.find({ userId }).exec();
  }

  async findEntryByCourseId(courseId: Types.ObjectId): Promise<Entry[] | null> {
    return await this.entryModel.find({ courseId }).exec();
  }

  async findEntryByFilter(filter: any): Promise<Entry[] | null> {
    return await this.entryModel.find(filter).exec();
  }

  async findAllEntries(): Promise<Entry[]> {
    return await this.entryModel.find().exec();
  }

  async updateEntry(entryId: Types.ObjectId, updateData: Partial<Entry>): Promise<any | null> {
    return await this.entryModel.findByIdAndUpdate(entryId, updateData, { new: true }).exec();
  }

  async deleteEntry(entryId: Types.ObjectId): Promise<Entry | null> {
    return await this.entryModel.findByIdAndDelete(entryId).exec();
  }
}
