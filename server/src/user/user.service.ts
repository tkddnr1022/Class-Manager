import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { CreateOAuthCommand } from './commands/impl/create-oauth.command';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async createUser(createUserCommand: CreateUserCommand) {
        const { username, email, password, studentId } = createUserCommand;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        return this.userRepository.createUser({
            username: username,
            email: email,
            password: hashedPassword,
            studentId: studentId
        });
    }

    async createOAuth(createOAuthCommand: CreateOAuthCommand) {
        const { oId, email, auth } = createOAuthCommand;
        const salt = await bcrypt.genSalt();
        const rand = Math.random().toString(36).slice(-12);
        const hashedPassword = await bcrypt.hash(rand, salt);
        return this.userRepository.createUser({
            email: email,
            password: hashedPassword,
            oId: oId,
            auth: auth,
            verified: true,
        });
    }

    async getUserById(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        return this.userRepository.findUserById(userObjectId);
    }

    async getUserByEmail(email: string) {
        return this.userRepository.findUserByEmail(email);
    }

    async getUserByStudentId(studentId: string) {
        return this.userRepository.findUserByStudentId(studentId);
    }

    async getUserByOId(oId: string) {
        return this.userRepository.findUserByOId(oId);
    }

    async getVerification(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        return this.userRepository.findVerification(userObjectId);
    }

    async listUsers() {
        return this.userRepository.findAllUsers();
    }

    async updateUser(updateUserCommand: UpdateUserCommand) {
        const { userId, username, email, password, studentId, verified, verification } = updateUserCommand;
        const salt = await bcrypt.genSalt();
        const hashedPassword = password ? await bcrypt.hash(password, salt) : undefined;
        const userObjectId = new Types.ObjectId(userId);
        return this.userRepository.updateUser(userObjectId, { username, email, password: hashedPassword, studentId, verified, verification });
    }

    async deleteUser(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        return this.userRepository.deleteUser(userObjectId);
    }
}
