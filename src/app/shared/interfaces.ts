import { statusTypes, priorityTypes } from './types';

export interface User {
    email: string;
    uid: string;
}

export interface Project {
    name: string;
    description: string;
    dateCreated: string;
    dateDue: string;
    dateCompleted: string;
    status: statusTypes;
    priority: priorityTypes;
}

export interface Task {
    description: string;
    dateCreated: string;
    dateDue: string;
    dateCompleted: string;
    weight: number;
    status: statusTypes;
    assignedTo: number; // uid
}
