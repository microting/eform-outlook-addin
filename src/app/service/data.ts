import { CRANET, WATERT, CRANEID, WATERID } from "./state";

export class Crane {
    ship: {id: string, value: string}[];
    quay: {id: string, value: string}[];
    crane: {id: string, value: string}[];
    workers: {id: string, value: string}[];
    message: string;
}

export class Water {
    ship: {id, value}[];
    quay: {id, value}[];
    workers: {id, value}[];
    message: string;
}

export const MockEForm: (CRANET | WATERT)[] = [
    CRANEID,
    WATERID
];
