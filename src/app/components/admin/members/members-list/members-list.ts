import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberStore } from '../../../../stores/member.store';
import { Router } from '@angular/router';
import { MemberData } from '../../../../interfaces/members.interface';

@Component({
  selector: 'app-members-list',
  imports: [],
  templateUrl: './members-list.html',
  styleUrl: './members-list.scss'
})
export class MembersList implements OnInit{

  memberStore = inject(MemberStore);
  router = inject(Router);


  members = this.memberStore.members;
  loading = this.memberStore.loading;

  ngOnInit(): void {
    this.memberStore.load()
  }

  edit(member: MemberData) {
    this.router.navigateByUrl(`/admin/members/edit/${member.id}`);
  }

  delete(id: number) {
    if (!confirm('¿Eliminar miembro?')) return;
    this.memberStore.remove(id).subscribe();
  }

}
