import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { TeamStore } from '../../../../stores/team.store';
import { TeamData } from '../../../../interfaces/team.interface';
import { Router } from '@angular/router';
import { Loader } from '../../../shared/loader/loader';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TeamsForm } from "../teams-form/teams-form";

@Component({
  selector: 'app-teams-list',
  imports: [Loader, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, TeamsForm],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.scss',
})
export class TeamsList implements OnInit {
  private teamStore = inject(TeamStore);
  teams = this.teamStore.teams;
  loading = this.teamStore.loading;
  router = inject(Router);

  // null = modal cerrado | undefined = crear nuevo | ProjectData = editar
  selectedTeam = signal<TeamData | null | undefined>(undefined);

  displayedColumns: string[] = ['name', 'description', 'actions'];

  dataSource = new MatTableDataSource<TeamData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.teams();
    });

    // Solo se filtra por nombre.
    this.dataSource.filterPredicate = (team: TeamData, filter: string) => {
      return (team.name ?? '').toLowerCase().includes(filter);
    };
  }

  ngOnInit(): void {
    this.teamStore.loadAll();
  }

  openTeamModal(): void {
    this.selectedTeam.set(null); // null = modo crear
  }

  editTeamModal(team: TeamData): void {
    this.selectedTeam.set(team); // proyecto = modo editar
  }

  closeModal(): void {
    this.selectedTeam.set(undefined); // undefined = cerrado
    this.teamStore.loadAll();
  }

  isModalOpen(): boolean {
    return this.selectedTeam() !== undefined;
  }

  deleteTeam(id: number) {
    if (!confirm('¿Deseas eliminar el equipo?')) return;
    this.teamStore.delete(id).subscribe();
  }

  filterTeamsTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
