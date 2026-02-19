import { Component, inject, input, output } from '@angular/core';
import { TaskModel } from '../../models/task/task';
import { TaskService } from '../../services/task-service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TaskEditor } from '../task-editor/task-editor';

@Component({
  selector: 'app-task',
  imports: [MatIconModule],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  taskService = inject(TaskService);
  private dialog = inject(MatDialog);

  task = input.required<TaskModel>();

  deleteTaskOutput = output<number>();
  taskUpdated = output<TaskModel>();

  openEditDialog() {
    this.dialog.open(TaskEditor, {
      data: { task: this.task() },
      width: '480px',
    }).afterClosed().subscribe((updatedTask: TaskModel | undefined) => {
      if (updatedTask) {
        this.taskUpdated.emit(updatedTask);
      }
    });
  }

  deleteTask() {
    this.taskService.deleteTask(this.task().id).subscribe({
      next: () => {
        this.deleteTaskOutput.emit(this.task().id);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }
}
