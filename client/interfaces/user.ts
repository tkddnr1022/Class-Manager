export default interface User{
    _id: string;
    email: string;
    roles: string[];
    verified: boolean;
    studentId?: string;
    username?: string;
    auth?: string;
}