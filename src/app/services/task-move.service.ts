import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskModel } from '../models/task/task';

export interface TaskRemovedFromLane {
  laneId: number;
  taskId: number;
}

export interface TaskAddedToLane {
  laneId: number;
  task: TaskModel;
}

@Injectable({
  providedIn: 'root',
})
export class TaskMoveService {
  private removedSubject = new Subject<TaskRemovedFromLane>();
  private addedSubject = new Subject<TaskAddedToLane>();

  /** Emit when a task was moved to another lane so the source lane can remove it. */
  readonly removedFromLane$ = this.removedSubject.asObservable();

  /** Emit when a new task was created so the lane can add it. */
  readonly addedToLane$ = this.addedSubject.asObservable();

  notifyRemovedFromLane(laneId: number, taskId: number): void {
    this.removedSubject.next({ laneId, taskId });
  }

  notifyAddedToLane(laneId: number, task: TaskModel): void {
    this.addedSubject.next({ laneId, task });
  }
}
