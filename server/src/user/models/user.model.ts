import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/auth/enums/roles.enum';
import { Verification } from 'src/auth/interfaces/verification.interface';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @ApiProperty()
    @Prop({ required: true, unique: true })
    email: string;

    @ApiProperty()
    @Prop({ required: true })
    password: string;

    @ApiPropertyOptional()
    @Prop()
    username?: string;

    @ApiPropertyOptional()
    @Prop()
    studentId?: string;

    @ApiPropertyOptional()
    @Prop({ type: [String], default: [Role.Student] })
    roles?: Role[];

    @ApiPropertyOptional()
    @Prop({ default: 'native' })
    auth?: string;

    @ApiPropertyOptional()
    @Prop()
    oId?: string;

    @ApiPropertyOptional()
    @Prop({ type: Verification })
    verification?: Verification;
}

export const UserSchema = SchemaFactory.createForClass(User);