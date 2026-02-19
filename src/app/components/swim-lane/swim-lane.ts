import { Component, input, signal } from '@angular/core';
import { inject } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SwimLaneModel } from '../../models/swim-lane/swim-lane';
import { SwimLaneService } from '../../services/swim-lane-service';
import { TaskService } from '../../services/task-service';
import { TaskModel } from '../../models/task/task';
import { Task } from '../task/task';
import { TaskCreator } from '../task-creator/task-creator';
import { TaskMoveService } from '../../services/task-move.service';

@Component({
  selector: 'app-swim-lane',
  imports: [DragDropModule, MatIconModule, Task],
  templateUrl: './swim-lane.html',
  styleUrl: './swim-lane.css',
})
export class SwimLane {
  taskService = inject(TaskService);
  swimLaneService = inject(SwimLaneService);
  taskMoveService = inject(TaskMoveService);
  private dialog = inject(MatDialog);

  swimLane = input.required<SwimLaneModel>();
  connectedLaneIds = input<string[]>([]);

  tasks = signal<TaskModel[]>([]);

  ngOnInit() {
    this.taskService.getTasksBySwimLane(this.swimLane().id).subscribe({
      next: (tasks: TaskModel[]) => this.tasks.set(tasks),
      error: (error: string) => console.error(error),
    });

    this.taskMoveService.removedFromLane$.subscribe(({ laneId, taskId }) => {
      if (laneId === this.swimLane().id) {
        this.tasks.update((list) => list.filter((t) => t.id !== taskId));
      }
    });

    this.taskMoveService.addedToLane$.subscribe(({ laneId, task }) => {
      if (laneId === this.swimLane().id) {
        this.tasks.update((list) => [...list, task]);
      }
    });
  }

  onDrop(event: CdkDragDrop<TaskModel[]>) {
    const currentTasks = this.tasks();
    if (event.previousContainer === event.container) {
      const copied = [...currentTasks];
      moveItemInArray(copied, event.previousIndex, event.currentIndex);
      this.tasks.set(copied);
      const movedTask = copied[event.currentIndex];
      this.taskService.updateTask({ ...movedTask, position: event.currentIndex }).subscribe({
        error: (err) => console.error('Failed to reorder task', err),
      });
      return;
    }

    const task = event.item.data as TaskModel;
    const previousId = event.previousContainer.id;
    const previousLaneId = parseInt(previousId.replace('lane-', ''), 10);

    const updatedTask: TaskModel = {
      ...task,
      listId: this.swimLane().id,
      position: event.currentIndex,
    };

    // Optimistic update: show in target immediately, remove from source
    const newTasks = [...currentTasks];
    newTasks.splice(event.currentIndex, 0, updatedTask);
    this.tasks.set(newTasks);
    this.taskMoveService.notifyRemovedFromLane(previousLaneId, task.id);

    this.taskService.updateTask(updatedTask).subscribe({
      error: (err) => {
        console.error('Failed to move task', err);
        this.tasks.update((list) => list.filter((t) => t.id !== task.id));
        this.taskMoveService.notifyAddedToLane(previousLaneId, task);
      },
    });
  }

  onDeleteTask(taskId: number) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
  }

  onTaskUpdated(updated: TaskModel) {
    this.tasks.update((list) => list.map((t) => (t.id === updated.id ? updated : t)));
  }

  openAddTask() {
    this.dialog.open(TaskCreator, {
      data: { listId: this.swimLane().id },
      width: '480px',
    }).afterClosed().subscribe((task: TaskModel | undefined) => {
      if (task?.listId) {
        this.taskMoveService.notifyAddedToLane(task.listId, task);
      }
    });
  }
}

