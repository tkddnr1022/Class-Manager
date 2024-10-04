import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import Coordinate from 'src/course/interfaces/coordinate.interface';

export type EntryDocument = HydratedDocument<Entry>;

@Schema({ timestamps: true })
export class Entry {
    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Course' })
    courseId: Types.ObjectId;

    @Prop({ required: true})
    deviceId: string;

    @Prop({ type: Coordinate, required: true})
    location: Coordinate;

    @Prop({ default: Date.now() })
    entryTime?: Date;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);