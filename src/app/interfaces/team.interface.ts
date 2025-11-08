import { MemberData } from "./members.interface";

export interface TeamData{
  id: number;
  name:string;
  members: MemberData[];
}
