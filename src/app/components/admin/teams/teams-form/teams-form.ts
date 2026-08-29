import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamStore } from '../../../../stores/team.store';
import { TeamService } from '../../../../services/team';
import { TeamData } from '../../../../interfaces/team.interface';

@Component({
  selector: 'app-teams-form',
  imports: [ReactiveFormsModule],
  templateUrl: './teams-form.html',
  styleUrl: './teams-form.scss'
})
export class TeamsForm implements OnInit{

  team = input<TeamData | null>(null);
  closed  = output<void>();

  private fb = inject(FormBuilder);
  private teamStore = inject(TeamStore);
  teamService = inject(TeamService);


  editing = false;
  teamId?: number;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['']
  });

  ngOnInit(): void {

    const team = this.team();

    if(team){
      this.editing = true;
      this.teamId = team.id;
          this.form.patchValue({
            name: team.name,
            description: team.description
          });
    }
  }

  onSubmit(){
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if(this.editing && this.teamId){
      this.teamStore.update(this.teamId, formValue).subscribe({
        next: () => this.closed.emit(), // 👇 Cierra modal en lugar de navegar
        error: (err) => console.error(err),
      });
    } else {
      this.teamStore.create(formValue).subscribe({
        next: () => this.closed.emit(), // 👇 Cierra modal en lugar de navegar
        error: (err) => console.error(err),
      })
    }

    this.form.reset();
  }

  onClose(): void {
    this.closed.emit();
  }
}
