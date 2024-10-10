import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import Coordinate from 'src/course/interfaces/coordinate.interface';

export type EntryDocument = HydratedDocument<Entry>;

@Schema({ timestamps: true })
export class Entry {
    @ApiProperty()
    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    userId: Types.ObjectId;

    @ApiProperty()
    @Prop({ type: Types.ObjectId, required: true, ref: 'Course' })
    courseId: Types.ObjectId;

    @ApiProperty()
    @Prop({ required: true})
    deviceId: string;

    @ApiProperty()
    @Prop({ type: Coordinate, required: true})
    location: Coordinate;

    @ApiPropertyOptional()
    @Prop({ default: Date.now })
    entryTime?: Date;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);