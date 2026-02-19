import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskModel } from '../../models/task/task';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task-service';

export interface TaskCreatorDialogData {
  listId?: number;
}

@Component({
  selector: 'app-task-creator',
  imports: [ReactiveFormsModule],
  templateUrl: './task-creator.html',
  styleUrl: './task-creator.css',
})
export class TaskCreator {
  private taskService = inject(TaskService);
  private dialogRef = inject(MatDialogRef<TaskCreator>);
  private data = inject<TaskCreatorDialogData | null>(MAT_DIALOG_DATA, { optional: true });

  formBuilder = inject(FormBuilder);

  taskForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    dueDate: ['', Validators.required],
  });

  get listId(): number {
    return this.data?.listId ?? 1;
  }

  onSubmit() {
    if (this.taskForm.invalid) return;

    const newTask: Partial<TaskModel> = {
      listId: this.listId,
      title: this.taskForm.value.title ?? '',
      description: this.taskForm.value.description ?? '',
      dueDate: this.taskForm.value.dueDate ?? null,
      position: 0,
      labels: [],
    };

    this.taskService.createTask(newTask as TaskModel).subscribe({
      next: (task) => this.dialogRef.close(task),
      error: (error) => {
        console.error(error);
        alert('Error creating task');
      },
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
