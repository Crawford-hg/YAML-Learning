import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SwimLaneService } from '../../services/swim-lane-service';
import { SwimLane } from '../swim-lane/swim-lane';
import { SwimLaneModel } from '../../models/swim-lane/swim-lane';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, SwimLane, MatIconModule],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board implements OnInit {
  swimLaneService = inject(SwimLaneService);
  router = inject(Router);
  swimLanes = signal<SwimLaneModel[]>([]);

  laneIds = computed(() => this.swimLanes().map((l) => 'lane-' + l.id));

  connectedIdsForLane(lane: SwimLaneModel): string[] {
    const selfId = 'lane-' + lane.id;
    return this.laneIds().filter((id) => id !== selfId);
  }

  onLaneDrop(event: CdkDragDrop<SwimLaneModel[]>) {
    const lanes = [...this.swimLanes()];
    moveItemInArray(lanes, event.previousIndex, event.currentIndex);
    this.swimLanes.set(lanes);
    lanes.forEach((lane, index) => {
      if (lane.position !== index) {
        this.swimLaneService.updateSwimLane(lane.id, { position: index }).subscribe({
          error: (err) => console.error('Failed to update lane position', err),
        });
      }
    });
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  ngOnInit() {
    this.swimLaneService.getSwimLanes().subscribe({
      next: (swimLaneData) => this.swimLanes.set(swimLaneData),
      error: (error) => console.error('The API call failed:', error),
    });
  }
}