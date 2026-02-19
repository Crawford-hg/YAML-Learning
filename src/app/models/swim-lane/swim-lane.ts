import { Task } from "../../components/task/task";

export interface SwimLaneModel {
    id: number;
    name: string;
    position: number;
    boardId: number;
    cards: Task[];
}
