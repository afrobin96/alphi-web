import { Component, inject, OnInit } from '@angular/core';
import { TeamStore } from '../../../../stores/team.store';
import { TeamData } from '../../../../interfaces/team.interface';
import { Router, RouterLink } from '@angular/router';
import { Loader } from "../../../shared/loader/loader";
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-teams-list',
  imports: [Loader, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.scss'
})
export class TeamsList implements OnInit{

  private teamStore= inject(TeamStore);
  teams = this.teamStore.teams;
  loading = this.teamStore.loading;
  router = inject(Router);

  displayedColumns: string[] = ['name', 'description', 'actions'];

  ngOnInit(): void {
    this.teamStore.loadAll();
  }

  edit(team: TeamData){
      this.router.navigateByUrl(`/admin/teams/edit/${team.id}`);
  }


  deleteTeam(id: number){
    if (!confirm('¿Deseas eliminar el equipo?')) return;
    this.teamStore.delete(id).subscribe();
  }

}
