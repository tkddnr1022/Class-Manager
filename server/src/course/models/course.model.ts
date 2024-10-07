import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import Coordinate from '../interfaces/coordinate.interface';
import { ApiProperty } from '@nestjs/swagger';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
    @ApiProperty()
    @Prop({ required: true })
    title: string;

    @ApiProperty()
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;

    @ApiProperty()
    @Prop({ required: true })
    startAt: Date;

    @ApiProperty()
    @Prop({ required: true })
    endAt: Date;

    @ApiProperty()
    @Prop({ required: true })
    location: Coordinate;
}

export const CourseSchema = SchemaFactory.createForClass(Course);