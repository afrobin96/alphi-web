import { Component, effect, inject, input, OnChanges, signal, SimpleChange } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MemberStore } from '../../../../stores/member.store';
import { TeamService } from '../../../../services/team';
import { MemberData } from '../../../../interfaces/members.interface';

@Component({
  selector: 'app-members-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './members-form.html',
  styleUrl: './members-form.scss'
})
export class MembersForm {

  selectedMember = input<any | null>(null);

  private fb = inject(FormBuilder);
  private memberStore = inject(MemberStore);
  private teamService = inject(TeamService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  editing = false;
  teams = signal<any[]>([]);

  form = this.fb.group({
    name: ['', Validators.required],
    rol: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    teamId: [null],
  });


  constructor() {
    this.teamService.loadAll().subscribe((team) => this.teams.set(team));


    effect(() => {
      const member = this.selectedMember();

      if (!member) {
        this.form.reset();
        return;
      }

      this.form.patchValue({
        name: member.name,
        rol: member.role,
        email: member.email,
        teamId: member.team?.id ?? null,
      });
    });
  }

  onSubmit(){
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const member = this.selectedMember();

    const teamId = formValue.teamId ? Number(formValue.teamId) : null

    if(member?.id){
      this.memberStore.update(member.id, {
        name: formValue.name!,
        rol: formValue.rol!,
        email: formValue.email!,
      }).subscribe({
        next: () => {
          if (formValue.teamId !== null){
            this.memberStore.assignTeam(member.id, teamId!).subscribe();
          }
        },
      });

      return;
    }

    this.memberStore.add({
      name: formValue.name!,
      rol: formValue.rol!,
      email: formValue.email!,
    }).subscribe({
        next: (newMember: MemberData) => {
          if (formValue.teamId !== null){
            this.memberStore.assignTeam(newMember.id!, teamId!).subscribe();
          }
        },
      });
    this.form.reset();
    this.router.navigateByUrl('admin/members');
  }

}
