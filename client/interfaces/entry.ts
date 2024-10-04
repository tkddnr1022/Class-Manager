export default interface Entry {
    courseId: {
        title: string,
        createdBy: string,
    },
    userId: {
        username: string,
        studentId: string,
    },
    entryTime: Date,
}