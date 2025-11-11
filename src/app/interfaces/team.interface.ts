import { MemberData } from "./members.interface";

export interface TeamData{
  id: number;
  name:string;
  description: string;
  members: MemberData[];
}
