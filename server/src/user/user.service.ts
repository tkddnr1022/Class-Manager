import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { UpdateUserCommand } from './commands/impl/update-user.command';

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

    async listUsers() {
        return this.userRepository.findAllUsers();
    }

    async updateUser(updateUserCommand: UpdateUserCommand) {
        const { userId, username, email, password, studentId } = updateUserCommand;

        const userObjectId = new Types.ObjectId(userId);
        return this.userRepository.updateUser(userObjectId, { username, email, password, studentId });
    }

    async deleteUser(userId: string) {
        const userObjectId = new Types.ObjectId(userId);
        return this.userRepository.deleteUser(userObjectId);
    }
}
