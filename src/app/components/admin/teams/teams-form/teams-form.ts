import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TeamStore } from '../../../../stores/team.store';

@Component({
  selector: 'app-teams-form',
  imports: [],
  templateUrl: './teams-form.html',
  styleUrl: './teams-form.scss'
})
export class TeamsForm {
  private fb = inject(FormBuilder);
  private teamStore = inject(TeamStore);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  });

  onSubmit(){
    if(this.form.valid){
      this.teamStore.create(this.form.value);
      this.form.reset();
    }
  }
}
