
export interface ProjectData{
    id?: number;
    name: string;
    description?: string;
    status?: 'active' | 'completed' | 'cancelled';
    client?: {id: number, name: string} | null;
    team?: {id: number, name: string} | null;
    createdAt?: string;
    completedAt?: string | null;
}
