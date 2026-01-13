import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberStore } from '../../../../stores/member.store';
import { Router, RouterLink } from '@angular/router';
import { MemberData } from '../../../../interfaces/members.interface';
import { Loader } from "../../../shared/loader/loader";
import { TeamStore } from '../../../../stores/team.store';
import { TeamData } from '../../../../interfaces/team.interface';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-members-list',
  imports: [Loader, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './members-list.html',
  styleUrl: './members-list.scss'
})
export class MembersList implements OnInit{

  memberStore = inject(MemberStore);
  teamStore = inject(TeamStore);
  router = inject(Router);


  members = this.memberStore.members;
  loading = this.memberStore.loading;

  displayedColumns: string[] = ['name', 'rol', 'email', 'team', 'actions'];

  ngOnInit(): void {
    this.memberStore.load()
    this.teamStore.loadAll()
  }

  edit(member: MemberData) {
    this.router.navigateByUrl(`/admin/members/edit/${member.id}`);
  }

  delete(id: number) {
    if (!confirm('¿Eliminar miembro?')) return;
    this.memberStore.remove(id).subscribe();
  }


}
