import { Component, inject, OnInit } from '@angular/core';
import { TeamStore } from '../../../../stores/team.store';
import { TeamData } from '../../../../interfaces/team.interface';
import { Router, RouterLink } from '@angular/router';
import { Loader } from "../../../shared/loader/loader";

@Component({
  selector: 'app-teams-list',
  imports: [Loader, RouterLink],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.scss'
})
export class TeamsList implements OnInit{

  private teamStore= inject(TeamStore);
  teams = this.teamStore.teams;
  loading = this.teamStore.loading;
  router = inject(Router);



  ngOnInit(): void {
    this.teamStore.loadAll();
  }

  edit(team: TeamData){
      this.router.navigateByUrl(`/admin/teams/edit/${team.id}`);
  }


  deleteTeam(id: number){
    if (!confirm('¿Deseas eliminar el equipo?')) return;
    this.teamStore.delete(id);
  }

}
