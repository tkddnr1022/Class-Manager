export default interface Health {
    status: string;
    info: {
        mongodb: {
            status: string;
        }
    },
    error: Object;
    details: Object;
}