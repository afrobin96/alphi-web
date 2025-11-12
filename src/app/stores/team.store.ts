import { inject, Injectable, signal } from "@angular/core";
import { ClientData } from "../interfaces/client.interface";
import { TeamData } from "../interfaces/team.interface";
import { TeamService } from "../services/team";

@Injectable({
  providedIn: 'root',
})
export class TeamStore{
  teams = signal<TeamData[]>([]);

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  error = signal<string | null>(null);

  teamService = inject(TeamService);

  loadAll(){
    this._loading.set(true);
    this.teamService.loadAll().subscribe({
      next: (data) => {
        this.teams.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando los equipos');
        console.log(err);
        this._loading.set(false);
      }
    });
  }

  create(client: Partial<ClientData>){
    this._loading.set(true);
    this.teamService.create(client).subscribe({
      next: ()=> {
        this.loadAll();
      },
      error: (err) => {
        this.error.set('Error creando el equipo');
        console.log(err);
        this._loading.set(false);
      }
    });
  }

  delete(id: number){
    this._loading.set(true);
    this.teamService.delete(id).subscribe({
      next: ()=> {
        this.loadAll();
      },
      error: (err) => {
        this.error.set('Error eliminando el equipo');
        console.log(err);
        this._loading.set(false);
      }
    })
  }
}
