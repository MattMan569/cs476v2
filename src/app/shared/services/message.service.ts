import { PrivateMessage } from '../interfaces';
import { messageServiceType } from '../types';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

// Abstract message service class
abstract class MessageService {
    abstract sendMessage(message: PrivateMessage): void;
    abstract getAllMessagesByRecipientId(recipientId: string): Promise<PrivateMessage[]>;
    abstract getUserMessagesByRecipientId?(recipientId: string): Promise<PrivateMessage[]>;
    abstract getSystemMessagesByRecipientId?(recipientId: string): Promise<PrivateMessage[]>;
}

// Send user composed messages
class UserMessageService implements MessageService {
    constructor(private afa: AngularFireAuth, private afs: AngularFirestore) {}

    sendMessage(message: PrivateMessage): void {
        message.dateSent = Date.now();
        message.messageType = 'User Message';
        message.isRead = false;

        // Add the message to the database
        const messagesCollection = this.afs.collection('messages');
        messagesCollection.add(message).then(ref => {
            ref.update({ id: ref.id });
        });
    }

    // Get all messages for this user
    getAllMessagesByRecipientId(recipientId: string): Promise<PrivateMessage[]> {
        const messagesCollection = this.afs.collection('messages');
        return new Promise((resolve, reject) => {
            const messageArr: PrivateMessage[] = [];
            messagesCollection.ref
                .where('recipientId', '==', recipientId)
                .orderBy('dateSent', 'desc')
                .get()
                .then(result => {
                    result.forEach(doc => {
                        messageArr.push(doc.data() as PrivateMessage);
                    });
                    resolve(messageArr);
                })
                .catch(error => {
                    console.log(error);
                    reject();
                });
        });
    }

    // Get all user messages for this user
    getUserMessagesByRecipientId(recipientId: string): Promise<PrivateMessage[]> {
        const messagesCollection = this.afs.collection('messages');
        return new Promise((resolve, reject) => {
            const messageArr: PrivateMessage[] = [];
            messagesCollection.ref
                .where('recipientId', '==', recipientId)
                .where('messageType', '==', 'User Message')
                .orderBy('dateSent', 'desc')
                .get()
                .then(result => {
                    result.forEach(doc => {
                        messageArr.push(doc.data() as PrivateMessage);
                    });
                    resolve(messageArr);
                })
                .catch(error => {
                    console.log(error);
                    reject();
                });
        });
    }
}

// Send automatically generated system messages
class SystemMessageService implements MessageService {
    constructor(private afa: AngularFireAuth, private afs: AngularFirestore) {}

    // Augment the message then send it
    sendMessage(message: PrivateMessage): void {
        message.senderId = 'SYSTEM';
        message.dateSent = Date.now();
        message.subject = 'SYSTEM - Notification: ' + message.subject;
        message.message = 'The following is an automatically generated message.\n\n' + message.message;
        message.messageType = 'System Message';
        message.isRead = false;

        // Add the message to the database
        const messagesCollection = this.afs.collection('messages');
        messagesCollection.add(message).then(ref => {
            ref.update({ id: ref.id });
        });
    }

    // Get all messages for this user
    getAllMessagesByRecipientId(recipientId: string): Promise<PrivateMessage[]> {
        const messagesCollection = this.afs.collection('messages');
        return new Promise((resolve, reject) => {
            const messageArr: PrivateMessage[] = [];
            messagesCollection.ref
                .where('recipientId', '==', recipientId)
                .orderBy('dateSent', 'desc')
                .get()
                .then(result => {
                    result.forEach(doc => {
                        messageArr.push(doc.data() as PrivateMessage);
                    });
                    resolve(messageArr);
                })
                .catch(error => {
                    console.log(error);
                    reject();
                });
        });
    }

    // Get all system messages for this user
    getSystemMessagesByRecipientId(recipientId: string): Promise<PrivateMessage[]> {
        const messagesCollection = this.afs.collection('messages');
        return new Promise((resolve, reject) => {
            const messageArr: PrivateMessage[] = [];
            messagesCollection.ref
                .where('recipientId', '==', recipientId)
                .where('messageType', '==', 'System Message')
                .orderBy('dateSent', 'desc')
                .get()
                .then(result => {
                    result.forEach(doc => {
                        messageArr.push(doc.data() as PrivateMessage);
                    });
                    resolve(messageArr);
                })
                .catch(error => {
                    console.log(error);
                    reject();
                });
        });
    }
}

// Return the requested type of message delivery service
export class MessageServiceFactory {
    static CreateMessageService(type: messageServiceType, afa: AngularFireAuth, afs: AngularFirestore): MessageService {
        if (type === 'System Message') {
            return new SystemMessageService(afa, afs);
        } else if (type === 'User Message') {
            return new UserMessageService(afa, afs);
        }
    }
}
