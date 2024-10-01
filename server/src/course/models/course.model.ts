import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import Coordinate from '../interfaces/coordinate.interface';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId;

    @Prop({ required: true })
    startAt: Date;

    @Prop({ required: true })
    endAt: Date;

    @Prop({ required: true })
    location: Coordinate;
}

export const CourseSchema = SchemaFactory.createForClass(Course);