import { LabelModel } from "../../models/label/label";


export interface TaskModel {
  id: number;
  listId: number;
  title: string;
  description: string;
  position: number;
  dueDate: string | null; // Can be an ISO date string or null
  labels: LabelModel[];
}