import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Task } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private tasksCollection: AngularFirestoreCollection<Task>;
    private tasks: Task[];

    constructor(private afs: AngularFirestore) {
        this.tasksCollection = this.afs.collection('tasks');
        this.tasksCollection.valueChanges().subscribe((tasks: Task[]) => {
            this.tasks = tasks;
        });
    }

    getTasksByProjectId(projectId: string): Task[] {
        const taskArr: Task[] = [];

        for (const task of this.tasks) {
            if (task.projectId === projectId) {
                taskArr.push(task);
            }
        }

        return taskArr;
    }

    addTask(task: Task): void {
        const userRef = this.afs.collection('users').ref;
        // Replace the displayName with the uid
        userRef
            .where('displayName', '==', task.assignedTo)
            .get()
            .then(result => {
                result.forEach(doc => {
                    // console.log(doc.data());
                    task.assignedTo = doc.data().uid;
                });

                // Add the task
                this.tasksCollection.add(task).then(ref => {
                    ref.update({ id: ref.id });
                });
            });
    }

    run(): void {}
}
