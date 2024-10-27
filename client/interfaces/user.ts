export default interface User{
    _id: string;
    email: string;
    roles: string[];
    studentId?: string;
    username?: string;
    auth?: string;
}