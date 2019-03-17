import { statusTypes, priorityTypes } from './types';

export interface User {
    uid: string;
    email: string;
    displayName: string;
}

export interface Project {
    id: string; // https://stackoverflow.com/a/51403280
    name: string;
    description: string;
    dateCreated: firebase.firestore.Timestamp; // https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
    dateDue: firebase.firestore.Timestamp;
    dateCompleted: firebase.firestore.Timestamp;
    status: statusTypes;
    priority: priorityTypes;
    manager: number; // uid (creator)
}

export interface Task {
    id: string;
    projectId: string; // Project -> id
    description: string;
    dateCreated: firebase.firestore.Timestamp;
    dateDue: firebase.firestore.Timestamp;
    dateCompleted: firebase.firestore.Timestamp;
    weight: number;
    status: statusTypes;
    assignedTo: number; // uid
    assignedBy: number; // uid
}
