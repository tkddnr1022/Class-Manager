export default interface Course{
    courseId: string;
    title: string;
    startAt: Date;
    endAt: Date;
    location: Coordinate;
}

export interface Coordinate{
    lat: number;
    lon: number;
}