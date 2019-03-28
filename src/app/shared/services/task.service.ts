import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Task } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private tasksCollection: AngularFirestoreCollection<Task>;
    // private tasks: Task[];

    constructor(private afs: AngularFirestore) {
        this.tasksCollection = this.afs.collection('tasks');
        // this.tasksCollection.valueChanges().subscribe((tasks: Task[]) => {
        //     this.tasks = tasks;
        // });
    }

    getTaskById(taskId: string): Promise<Task> {
        let task: Task;
        return new Promise((resolve, reject) => {
            this.tasksCollection.ref
                .where('id', '==', taskId)
                .get()
                .then(result => {
                    result.forEach(doc => {
                        task = doc.data() as Task;
                    });
                    resolve(task);
                })
                .catch(error => {
                    console.log(error);
                    reject();
                });
        });
    }

    getTasksByProjectId(projectId: string): Promise<Task[]> {
        return new Promise((resolve, reject) => {
            const taskArr: Task[] = [];
            this.tasksCollection.ref
                .where('projectId', '==', projectId)
                .orderBy('dateCreated', 'desc')
                .get()
                .then(result => {
                    result.forEach(doc => {
                        taskArr.push(doc.data() as Task);
                    });
                    resolve(taskArr);
                })
                .catch(error => {
                    console.log(error);
                    reject();
                });
        });
    }

    addTask(task: Task): Promise<any> {
        return new Promise((resolve, reject) => {
            const userRef = this.afs.collection('users').ref;

            // Replace the displayName with the uid
            userRef
                .where('displayName', '==', task.assignedTo)
                .get()
                .then(result => {
                    if (result.empty) {
                        reject();
                    }

                    result.forEach(doc => {
                        // console.log(doc.data());
                        task.assignedTo = doc.data().uid;
                    });

                    // Add the task
                    this.tasksCollection.add(task).then(ref => {
                        ref.update({ id: ref.id });
                    });

                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    reject();
                });
        });
    }

    updateTask(task: Task): Promise<any> {
        return new Promise((resolve, reject) => {
            const userRef = this.afs.collection('users').ref;
            userRef
                .where('displayName', '==', task.assignedTo)
                .get()
                .then(result => {
                    if (result.empty) {
                        reject();
                    }

                    result.forEach(doc => {
                        task.assignedTo = doc.data().uid;
                    });

                    this.tasksCollection.doc(task.id).update(task);

                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    reject();
                });
        });
    }

    deleteTask(task: Task): Promise<void> {
        return this.tasksCollection.doc(task.id).delete();
    }

    run(): void {}
}
