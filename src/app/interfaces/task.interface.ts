import { MemberData } from "./members.interface";
import { ProjectData } from "./project.interface";


export type TaskStatus = 'to_do' | 'in_course' | 'in_review' | 'reopened' | 'completed' | 'payment_pending' | 'paid';

export interface TaskStatusOption {
  value: TaskStatus;
  label: string;
}

export interface TaskStatusConfig {
  transitions: TaskStatus[];
  label: string;
}

export type TaskStatusMap = Record<TaskStatus, TaskStatusConfig>;
export interface TaskData {
  id?: number;
  title: string;
  description: string;
  value: number;
  status?: TaskStatus;
  project?: ProjectData | null;
  member?: MemberData | null;
}
