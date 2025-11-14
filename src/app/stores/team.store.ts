import { inject, Injectable, signal } from "@angular/core";
import { ClientData } from "../interfaces/client.interface";
import { TeamData } from "../interfaces/team.interface";
import { TeamService } from "../services/team";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TeamStore{
  private _teams = signal<TeamData[]>([]);
  teams = this._teams.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  teamService = inject(TeamService);

  loadAll(){
    this._loading.set(true);
    this.teamService.loadAll().pipe(
      tap({
        next: (res) => {
          this._teams.set(res);
          this._loading.set(false);
        },
        error: () => this._loading.set(false),
      })
    ).subscribe();
  }

  create(team: Partial<TeamData>){
    return this.teamService.create(team).pipe(
      tap((team)=> this._teams.update(curr => [team, ...curr]))
    );
  }

  update(id: number, payload: Partial<TeamData>){
      return this.teamService.update(id, payload).pipe(
        tap((team)=> this._teams.update(curr => curr.map(c => c.id === team.id ? team : c)))
      );
  }

  delete(id: number){
    return this.teamService.delete(id).pipe(
      tap(()=> this._teams.update(curr=> curr.filter(c => c.id !== id)))
    )
  }
}
