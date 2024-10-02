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
        // 수업 ID
        const course = await this.queryBus.execute(new GetCourseQuery(courseId));
        if (!course) {
            throw new BadRequestException("ERROR_COURSE_ID");
        }
        const { startAt, endAt, location } = course;

        // 유저 ID
        const isUserIdExist = (await this.entryRepository.findEntryByFilter({ courseId, userId })).length > 1;
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
        const isDeviceIdUsed = (await this.entryRepository.findEntryByFilter({ courseId, deviceId })).length > 1;
        if (isDeviceIdUsed) {
            throw new BadRequestException("ERROR_DEVICE_ID");
        }

        return await this.entryRepository.createEntry(createEntryCommand)
    }

    async getEntryById(entryId: Types.ObjectId) {
        return await this.entryRepository.findEntryById(entryId);
    }

    async getEntryByUserId(userId: Types.ObjectId) {
        return await this.entryRepository.findEntryByUserId(userId);
    }

    async getEntryByCourseId(courseId: Types.ObjectId) {
        return await this.entryRepository.findEntryByCourseId(courseId);
    }

    async listEntries() {
        return await this.entryRepository.findAllEntries();
    }

    async updateEntry(updateEntryCommand: UpdateEntryCommand) {
        const { entryId, userId, courseId, deviceId, location, entryTime } = updateEntryCommand;
        return await this.entryRepository.updateEntry(entryId, { userId, courseId, deviceId, location, entryTime });
    }

    async deleteEntry(entryId: Types.ObjectId) {
        return await this.entryRepository.deleteEntry(entryId);
    }
}
