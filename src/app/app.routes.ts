import { Routes } from '@angular/router';
import { Task } from './components/task/task';
import { Board } from './components/board/board';
import { Settings } from './components/settings/settings';


export const routes: Routes = [
  { path: 'task/id', component: Task },
  { path: 'board', component: Board },
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'settings', component: Settings },
];
