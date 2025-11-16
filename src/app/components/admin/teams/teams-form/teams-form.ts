import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamStore } from '../../../../stores/team.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-teams-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './teams-form.html',
  styleUrl: './teams-form.scss'
})
export class TeamsForm implements OnInit{
  private fb = inject(FormBuilder);
  private teamStore = inject(TeamStore);
  route = inject(ActivatedRoute);
  router = inject(Router);

  editing = false;
  teamId?: number;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  });

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;

    if(id){
      this.editing = true;
      this.teamId = id;
    }
  }

  onSubmit(){
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.teamId) {
      this.teamStore.update(this.teamId, formValue).subscribe();
      this.router.navigateByUrl('admin/teams');
    } else {
      this.teamStore.create(formValue).subscribe();
      this.router.navigateByUrl('admin/teams');
    }

    this.form.reset();
  }
}
