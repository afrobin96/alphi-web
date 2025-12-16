import { MemberData } from "./members.interface";
import { ProjectData } from "./project.interface";
import { TaskData } from "./task.interface";


export interface PaymentData {
  id: number,
  member: MemberData,
  project: ProjectData,
  task?: TaskData[],
  total: number,
  status: 'pending' | 'paid' | 'cancelled',
  note?: string,
  createdAt?: string,
}
