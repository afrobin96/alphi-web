import { MemberData } from "./members.interface";
import { ProjectData } from "./project.interface";


export type TaskStatus = 'to_do' | 'in_review' | 'reopened' | 'completed' | 'payment_pending' | 'paid';

export interface TaskData {
  id?: number;
  title: string;
  description: string;
  value: number;
  status?: TaskStatus;
  project?: ProjectData | null;
  member?: MemberData | null;
}
