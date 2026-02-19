import { Injectable } from '@angular/core';
import { SwimLaneModel } from '../models/swim-lane/swim-lane';
import { Observable, of } from 'rxjs';
import { Task } from '../components/task/task';

const STORAGE_KEY = 'swim-lanes';
const MIGRATION_KEY = 'swim-lanes-defaults-v1';

type StoredLane = Omit<SwimLaneModel, 'cards'>;

const DEFAULT_LANES: StoredLane[] = [
  { id: 1, name: 'To Do', boardId: 1, position: 0 },
  { id: 2, name: 'In Progress', boardId: 1, position: 1 },
  { id: 3, name: 'Done', boardId: 1, position: 2 },
];

@Injectable({
  providedIn: 'root',
})
export class SwimLaneService {
  private getLanes(): SwimLaneModel[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    let data: StoredLane[];
    const migrated = localStorage.getItem(MIGRATION_KEY);
    if (!raw || !migrated) {
      data = [...DEFAULT_LANES];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(MIGRATION_KEY, '1');
    } else {
      data = JSON.parse(raw) as StoredLane[];
    }
    return data.map((l) => ({ ...l, cards: [] as Task[] }));
  }

  private setLanes(lanes: SwimLaneModel[]): void {
    const toStore = lanes.map(({ id, name, position, boardId }) => ({
      id,
      name,
      position,
      boardId,
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }

  getSwimLanes(): Observable<SwimLaneModel[]> {
    return of(this.getLanes());
  }

  createSwimLane(lane: { name: string; boardId: number; position: number }): Observable<SwimLaneModel> {
    const lanes = this.getLanes();
    const nextId =
      lanes.length === 0 ? 1 : Math.max(...lanes.map((l) => l.id), 0) + 1;
    const created: SwimLaneModel = { ...lane, id: nextId, cards: [] };
    lanes.push(created);
    this.setLanes(lanes);
    return of(created);
  }

  updateSwimLane(
    id: number,
    updates: Partial<Pick<SwimLaneModel, 'name' | 'position'>>
  ): Observable<SwimLaneModel> {
    const lanes = this.getLanes();
    const idx = lanes.findIndex((l) => l.id === id);
    if (idx === -1) return of(lanes.find((l) => l.id === id) ?? ({} as SwimLaneModel));
    const updated = { ...lanes[idx], ...updates };
    lanes[idx] = updated;
    this.setLanes(lanes);
    return of(updated);
  }

  deleteSwimLane(id: number): Observable<void> {
    const lanes = this.getLanes().filter((l) => l.id !== id);
    this.setLanes(lanes);
    return of(undefined);
  }
}
