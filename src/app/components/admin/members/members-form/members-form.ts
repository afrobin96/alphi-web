import { Component, effect, inject, input, OnChanges, signal, SimpleChange } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MemberStore } from '../../../../stores/member.store';
import { MemberData } from '../../../../interfaces/members.interface';
import { TeamService } from '../../../../services/team';
import { MemberService } from '../../../../services/member';

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
  private memberService = inject(MemberService);
  private teamService = inject(TeamService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  editing = false;
  memberId?: number;
  teams = signal<any[]>([]);

  form = this.fb.group({
    name: ['', Validators.required],
    rol: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    teamId: [null as number | null],
  });

  ngOnInit(): void {
    this.teamService.loadAll().subscribe((team) => this.teams.set(team));
    const id = +this.route.snapshot.paramMap.get('id')!;

    if(id){
      this.editing = true;
      this.memberId = id;
      this.memberService.get(id).subscribe(member =>{
          this.form.patchValue({
            name: member.name,
            rol: member.rol,
            email: member.email,
            teamId: member.teamId?.id ?? null,
          });
      });
    }
  }


  onSubmit(){
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const teamId = formValue.teamId ? Number(formValue.teamId) : null

    if (this.editing && this.memberId) {
        this.memberStore.update(this.memberId, {
          name: formValue.name!,
          rol: formValue.rol!,
          email: formValue.email!,
        }).subscribe({
          next: () => {
            if (formValue.teamId !== null){
              this.memberStore.assignTeam(this.memberId!, teamId!).subscribe();
            }
          },
        });

        this.router.navigateByUrl('admin/members');
    } else {
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

}
