import { TeamData } from "./team.interface";

export interface MemberData{
  id?: number;
  name: string;
  rol: string;
  email: string;
  teamId?: TeamData | null;
}
