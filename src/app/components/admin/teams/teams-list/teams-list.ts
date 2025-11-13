import { Component, inject, OnInit } from '@angular/core';
import { TeamStore } from '../../../../stores/team.store';

@Component({
  selector: 'app-teams-list',
  imports: [],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.scss'
})
export class TeamsList implements OnInit{

  private teamStore= inject(TeamStore);
  teams = this.teamStore.teams;
  loading = this.teamStore.loading;


  ngOnInit(): void {
    this.teamStore.loadAll();
  }

  deleteTeam(id: number){
    if (!confirm('¿Deseas eliminar el equipo?')) return;
    this.teamStore.delete(id);
  }

}
