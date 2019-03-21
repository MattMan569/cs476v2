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
        this.tasksCollection.add(task).then(ref => {
            ref.update({ id: ref.id });
        });
    }

    run(): void {}
}
