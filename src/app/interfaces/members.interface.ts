import { TeamData } from "./team.interface";

export interface MemberData{
  id?: number;
  name: string;
  role: string;
  email: string;
  team?: TeamData | null;
}
