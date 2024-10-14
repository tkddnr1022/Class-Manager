import { BadRequestException, Injectable } from '@nestjs/common';
import { EntryRepository } from './repositories/entry.repository';
import { CreateEntryCommand } from './commands/impl/create-entry.command';
import { Types } from 'mongoose';
import { UpdateEntryCommand } from './commands/impl/update-entry.command';
import { QueryBus } from '@nestjs/cqrs';
import { GetCourseQuery } from 'src/course/queries/impl/get-course.query';
import * as haversine from 'haversine-distance';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EntryService {
    constructor(
        private readonly entryRepository: EntryRepository,
        private readonly queryBus: QueryBus,
        private readonly configService: ConfigService,
    ) { }

    async createEntry(createEntryCommand: CreateEntryCommand) {
        const { userId, courseId, deviceId, location: userLoc } = createEntryCommand;

        const userObjectId = new Types.ObjectId(userId);
        const courseObjectId = new Types.ObjectId(courseId);

        // 수업 ID
        const course = await this.queryBus.execute(new GetCourseQuery(courseId));
        if (!course) {
            throw new BadRequestException("ERROR_COURSE_ID");
        }
        const { startAt, endAt, location } = course;

        // 유저 ID
        const isUserIdExist = (await this.entryRepository.findEntryByFilter({ courseId: courseObjectId, userId: userObjectId })).length > 0;
        if (isUserIdExist) {
            throw new BadRequestException("ERROR_USER_ID");
        }

        // 현재 시간
        const currentTime = new Date();
        if (currentTime < startAt) {
            throw new BadRequestException("ERROR_START_TIME");
        }
        if (currentTime > endAt) {
            throw new BadRequestException("ERROR_END_TIME");
        }

        // 현재 위치
        const distance = haversine(userLoc, location);
        const range = this.configService.get<number>('LOCATION_RANGE');
        if (distance > range) {
            throw new BadRequestException("ERROR_LOCATION_RANGE");
        }

        // 디바이스 ID
        const isDeviceIdUsed = (await this.entryRepository.findEntryByFilter({ courseId: courseObjectId, deviceId })).length > 0;
        if (isDeviceIdUsed) {
            throw new BadRequestException("ERROR_DEVICE_ID");
        }

        return await this.entryRepository.createEntry({
            ...createEntryCommand,
            userId: userObjectId,
            courseId: courseObjectId,
        });
    }

    async getEntryById(entryId: string) {
        const entryObjectId = new Types.ObjectId(entryId);
        return await this.entryRepository.findEntryById(entryObjectId);
    }

    async getEntryByUserId(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        return await this.entryRepository.findEntryByUserId(userObjectId);
    }

    async getEntryByCourseId(courseId: string) {
        const courseObjectId = new Types.ObjectId(courseId);
        return await this.entryRepository.findEntryByCourseId(courseObjectId);
    }

    async listEntries() {
        return await this.entryRepository.findAllEntries();
    }

    async updateEntry(updateEntryCommand: UpdateEntryCommand) {
        const { entryId, userId, courseId, deviceId, location, entryTime } = updateEntryCommand;

        const entryObjectId = new Types.ObjectId(entryId);
        const userObjectId = new Types.ObjectId(userId);
        const courseObjectId = new Types.ObjectId(courseId);

        return await this.entryRepository.updateEntry(entryObjectId, {
            userId: userObjectId,
            courseId: courseObjectId,
            deviceId,
            location,
            entryTime,
        });
    }

    async deleteEntry(entryId: string) {
        const entryObjectId = new Types.ObjectId(entryId);
        return await this.entryRepository.deleteEntry(entryObjectId);
    }
}
