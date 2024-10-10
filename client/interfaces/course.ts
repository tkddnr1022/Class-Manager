export default interface Course{
    _id: string;
    title: string;
    startAt: Date;
    endAt: Date;
    location: Coordinate;
}

export interface Coordinate{
    lat: number;
    lon: number;
}