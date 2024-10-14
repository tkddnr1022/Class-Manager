import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/enums/roles.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @ApiProperty()
    @Prop({ required: true })
    username: string;

    @ApiProperty()
    @Prop({ required: true, unique: true })
    email: string;

    @ApiProperty()
    @Prop({ required: true })
    password: string;

    @ApiProperty()
    @Prop({ required: true })
    studentId: string;

    @ApiPropertyOptional()
    @Prop({ type: [String], default: [Role.Student] })
    roles?: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);