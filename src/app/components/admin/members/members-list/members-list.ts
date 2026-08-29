import { Component, computed, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberStore } from '../../../../stores/member.store';
import { Router } from '@angular/router';
import { MemberData } from '../../../../interfaces/members.interface';
import { Loader } from "../../../shared/loader/loader";
import { TeamStore } from '../../../../stores/team.store';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MembersForm } from "../members-form/members-form";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-members-list',
  imports: [Loader, MatTableModule, MatButtonModule, MatIconModule, MembersForm, MatPaginatorModule],
  templateUrl: './members-list.html',
  styleUrl: './members-list.scss'
})
export class MembersList implements OnInit{

  memberStore = inject(MemberStore);
  teamStore = inject(TeamStore);
  router = inject(Router);


  members = this.memberStore.members;
  loading = this.memberStore.loading;

  // null = modal cerrado | undefined = crear nuevo | ProjectData = editar
  selectedMember = signal<MemberData | null | undefined>(undefined);

  displayedColumns: string[] = ['name', 'rol', 'email', 'team', 'actions'];

  dataSource = new MatTableDataSource<MemberData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.members();
    });

    // Solo se filtra por nombre.
    this.dataSource.filterPredicate = (member: MemberData, filter: string) => {
      return (member.name ?? '').toLowerCase().includes(filter);
    };
  }

  ngOnInit(): void {
    this.memberStore.load()
    this.teamStore.loadAll()
  }

  openMemberModal(): void {
      this.selectedMember.set(null); // null = modo crear
    }

    editMemberModal(member: MemberData): void {
      this.selectedMember.set(member); // proyecto = modo editar
    }

    closeModal(): void {
      this.selectedMember.set(undefined); // undefined = cerrado
      this.memberStore.load();
    }

    isModalOpen(): boolean {
      return this.selectedMember() !== undefined;
    }

  remove(id: number) {
    if (!confirm('¿Eliminar miembro?')) return;
    this.memberStore.remove(id).subscribe();
  }

  filterProjectsTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
