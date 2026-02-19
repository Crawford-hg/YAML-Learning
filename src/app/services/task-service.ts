import { Injectable } from '@angular/core';
import { TaskModel } from '../models/task/task';
import { Observable, of } from 'rxjs';

const STORAGE_KEY = 'cards';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private getCards(): TaskModel[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as TaskModel[]) : [];
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  }

  private setCards(cards: TaskModel[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  }

  getTasksBySwimLane(id: number): Observable<TaskModel[]> {
    return of(this.getCards().filter((t) => t.listId === id));
  }

  getTasks(): Observable<TaskModel[]> {
    return of(this.getCards());
  }

  createTask(task: TaskModel): Observable<TaskModel> {
    const cards = this.getCards();
    const nextId =
      cards.length === 0 ? 1 : Math.max(...cards.map((c) => c.id), 0) + 1;
    const created: TaskModel = { ...task, id: nextId };
    cards.push(created);
    this.setCards(cards);
    return of(created);
  }

  updateTask(task: TaskModel): Observable<TaskModel> {
    const cards = this.getCards();
    const idx = cards.findIndex((c) => c.id === task.id);
    if (idx === -1) return of(task);
    cards[idx] = { ...task };
    this.setCards(cards);
    return of(cards[idx]);
  }

  deleteTask(id: number): Observable<void> {
    const cards = this.getCards().filter((c) => c.id !== id);
    this.setCards(cards);
    return of(undefined);
  }

  getTaskByBoard(boardId: number): Observable<TaskModel[]> {
    const rawLanes = localStorage.getItem('swim-lanes');
    const lanes = rawLanes ? (JSON.parse(rawLanes) as { id: number; boardId: number }[]) : [];
    const laneIds = new Set(lanes.filter((l) => l.boardId === boardId).map((l) => l.id));
    const cards = this.getCards().filter((t) => laneIds.has(t.listId));
    return of(cards);
  }

  getTaskBySwimLane(swimLaneId: number): Observable<TaskModel[]> {
    return of(this.getCards().filter((t) => t.listId === swimLaneId));
  }
}
