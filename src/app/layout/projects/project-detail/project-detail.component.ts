import { Component, OnInit } from '@angular/core';
import { Project, UserService, statusTypes, TaskService, Task } from 'src/app/shared';
import { ProjectService } from 'src/app/shared/services/project.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
    selector: 'app-project-detail',
    templateUrl: './project-detail.component.html',
    styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
    private project: Project;
    private canEdit: boolean;

    // Chart
    private projectTaskStatsData: number[] = [0, 0, 0, 0, 0];
    private projectTaskStatsLabels: statusTypes[] = ['Canceled', 'Complete', 'In Progress', 'Late', 'Paused'];
    private projectTaskStatsColors = [
        {
            backgroundColor: ['#868e96', '#28a745', '#007bff', '#dc3545', '#ffc107']
        }
    ];
    private renderChart = false;

    constructor(
        private afa: AngularFireAuth,
        private projectService: ProjectService,
        private taskService: TaskService,
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        enum ChartIndexes {
            Canceled,
            Complete,
            InProgress,
            Late,
            Paused
        }

        this.route.params.subscribe((params: Params) => {
            this.project = this.projectService.getProjectById(params.id);
            this.canEdit = this.project.manager === this.afa.auth.currentUser.uid;
            this.taskService.getTasksByProjectId(this.project.id).then((tasks: Task[]) => {
                tasks.forEach((task: Task) => {
                    if (task.status === 'Canceled') {
                        this.projectTaskStatsData[ChartIndexes.Canceled]++;
                    } else if (task.status === 'Complete') {
                        this.projectTaskStatsData[ChartIndexes.Complete]++;
                    } else if (task.status === 'In Progress') {
                        this.projectTaskStatsData[ChartIndexes.InProgress]++;
                    } else if (task.status === 'Late') {
                        this.projectTaskStatsData[ChartIndexes.Late]++;
                    } else if (task.status === 'Paused') {
                        this.projectTaskStatsData[ChartIndexes.Paused]++;
                    }
                });
                this.renderChart = true;
            });
        });
    }

    // Delete the project and all of its tasks
    onDeleteProject(): void {
        // Confirm the selection
        if (confirm('Are you sure you want to delete this project?\nThis action cannot be undone.')) {
            // First delete all of this project's tasks
            this.taskService
                .getTasksByProjectId(this.project.id)
                .then((tasks: Task[]) => {
                    tasks.forEach((task: Task) => {
                        this.taskService.deleteTask(task);
                    });
                })
                // Then delete the project itself
                .then(() => {
                    this.projectService.deleteProject(this.project).then(() => {
                        this.router.navigate(['..'], { relativeTo: this.route });
                    });
                });
        }
    }

    getProject(): Project {
        return this.project;
    }

    getManager(uid: string): string {
        return this.userService.getUserById(uid).displayName;
    }

    getCanEdit(): boolean {
        return this.canEdit;
    }

    // Task stats
    getProjectTaskStatsData() {
        return this.projectTaskStatsData;
    }

    // Task labels
    getProjectTaskStatsLabels() {
        return this.projectTaskStatsLabels;
    }

    getProjectTaskStatsColors() {
        return this.projectTaskStatsColors;
    }

    getRenderChart() {
        return this.renderChart;
    }

    onProjectTaskStatsHover() {}

    onProjectTaskStatsClick() {}
}
