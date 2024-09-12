import { Injectable } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) { }

    async createUser(createUserDto: CreateUserDto) {
        const { username, email, password, studentId } = createUserDto;
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
        return this.userRepository.findUserById(userId);
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

    async updateUser(userId: string, updateUserDto: UpdateUserDto) {
        return this.userRepository.updateUser(userId, updateUserDto);
    }

    async deleteUser(userId: string) {
        return this.userRepository.deleteUser(userId);
    }
}
