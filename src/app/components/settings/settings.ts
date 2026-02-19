import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { SwimLaneService } from '../../services/swim-lane-service';
import { SwimLaneModel } from '../../models/swim-lane/swim-lane';
import { TaskService } from '../../services/task-service';

const DEFAULT_BOARD_ID = 1;

@Component({
  selector: 'app-settings',
  imports: [MatIconModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  swimLaneService = inject(SwimLaneService);
  taskService = inject(TaskService);
  swimLanes = signal<SwimLaneModel[]>([]);
  showAddLaneForm = signal(false);
  newLaneName = signal('');

  router = inject(Router);

  ngOnInit() {
    this.swimLaneService.getSwimLanes().subscribe((lanes) => {
      this.swimLanes.set(lanes);
    });
  }

  openAddLane() {
    this.showAddLaneForm.set(true);
    this.newLaneName.set('');
  }

  cancelAddLane() {
    this.showAddLaneForm.set(false);
    this.newLaneName.set('');
  }

  addLane() {
    const name = this.newLaneName().trim();
    if (!name) return;
    const position = this.swimLanes().length;
    this.swimLaneService.createSwimLane({ name, boardId: DEFAULT_BOARD_ID, position }).subscribe({
      next: (lane) => {
        this.swimLanes.update((list) => [...list, lane]);
        this.showAddLaneForm.set(false);
        this.newLaneName.set('');
      },
      error: (err) => {
        console.error('Failed to create lane', err);
        alert('Failed to create lane');
      },
    });
  }

  deleteSwimLane(id: number) {
    this.taskService.getTaskBySwimLane(id).subscribe((tasks) => {
      if (tasks.length > 0) {
        alert('This lane has tasks. Please delete them first.');
      } else {
        this.swimLaneService.deleteSwimLane(id).subscribe(() => {
          this.swimLanes.update((lanes) => lanes.filter((lane) => lane.id !== id));
        });
      }
    });
  }


  goToBoard() {
    this.router.navigate(['/board']);
  }
}

