import { Component, input } from '@angular/core';
// import { ChangeDetectionStrategy } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  // MatDialog,
  // MatDialogActions,
  // MatDialogClose,
  // MatDialogContent,
  MatDialogRef,
  // MatDialogTitle,
} from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { inject } from '@angular/core';
import { TaskModel } from '../../models/task/task';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { TaskService } from '../../services/task-service';

@Component({
  selector: 'app-task-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './task-editor.html',
  styleUrl: './task-editor.css',
})
export class TaskEditor {
  readonly dialogRef = inject(MatDialogRef<TaskEditor>);
  readonly data = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);

  taskId = input.required<number>();

  taskService = inject(TaskService); 
  taskForm = this.formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    dueDate: ['', Validators.required],
  });


  ngOnInit() {
    this.taskForm.patchValue({
      title: this.data.task.title,
      description: this.data.task.description,
      dueDate: this.data.task.dueDate,
    });
  }

  onSubmit(){

    if (this.taskForm.invalid) {
    return;
    }

    let updatedTask = {
      id: this.data.task.id,
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      dueDate: this.taskForm.value.dueDate,
    };

    this.taskService.updateTask(updatedTask as TaskModel).subscribe({
      next: (task) => {
        this.dialogRef.close(task);
      },
      error: (error) => {
        console.error(error);
        alert('Error updating task');
      }
    });
  }
}
