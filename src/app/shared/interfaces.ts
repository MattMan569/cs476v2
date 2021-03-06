import { statusTypes, priorityTypes, messageServiceType } from './types';

export interface User {
    uid: string;
    email: string;
    displayName: string;
}

export interface Project {
    id: string; // https://stackoverflow.com/a/51403280 (second method)
    name: string;
    description: string;
    dateCreated: number; // Date object timestamp
    dateDue: number;
    dateCompleted: number;
    status: statusTypes;
    priority: priorityTypes;
    manager: string; // uid (creator)
}

export interface Task {
    id: string;
    projectId: string; // Project -> id
    description: string;
    dateCreated: number;
    dateDue: number;
    dateCompleted: number;
    weight: number;
    status: statusTypes;
    assignedTo: string; // uid
    assignedBy: string; // uid
}

export interface ChatMessage {
    id: string;
    senderId: string; // uid
    dateSent: number;
    message: string;
}

export interface PrivateMessage extends ChatMessage {
    recipientId: string; // uid
    isRead: boolean;
    messageType: messageServiceType;
    subject: string;
}
