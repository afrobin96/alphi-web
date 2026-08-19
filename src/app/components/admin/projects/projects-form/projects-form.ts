import { Component, inject, OnInit, computed, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../../services/project';
import { ProjectStore } from '../../../../stores/project.store';
import { ClientStore } from '../../../../stores/client.store';
import { TeamStore } from '../../../../stores/team.store';
import { ProjectData } from '../../../../interfaces/project.interface';

@Component({
  selector: 'app-projects-form',
  imports: [ReactiveFormsModule],
  templateUrl: './projects-form.html',
  styleUrl: './projects-form.scss'
})
export class ProjectsForm implements OnInit{

  project = input<ProjectData | null>(null);
  closed  = output<void>();

  fb = inject(FormBuilder);
  projectService = inject(ProjectService);
  projectStore = inject(ProjectStore);
  clientStore = inject(ClientStore);
  teamStore = inject(TeamStore);

  // inicialize form
  form = this.fb.group({
    name:['', Validators.required],
    description: [''],
    clientId: [null as number | null],
    teamId: [null as number | null]
  });

  editing = false;
  projectId?: number;
  clients = computed(() => this.clientStore.clients());
  teams = computed(() => this.teamStore.teams());

  ngOnInit(): void {
    this.clientStore.loadAll();
    this.teamStore.loadAll();

    const project = this.project();

    if(project){
      this.editing = true;
      this.projectId = project.id;
      this.form.patchValue({
        name:        project.name,
        description: project.description ?? '',
        clientId:    project.client?.id ?? null,
        teamId:      project.team?.id   ?? null,
      });
    }
  }

  save(){
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload = {
      ...formValue,
      name: formValue.name || '',
      clientId: formValue.clientId ? Number(formValue.clientId) : null,
      teamId: formValue.teamId ? Number(formValue.teamId) : null
    };

    if(this.editing && this.projectId){
      this.projectStore.update(this.projectId, payload).subscribe({
        next: () => this.closed.emit(), // 👇 Cierra modal en lugar de navegar
        error: (err) => console.error(err),
      });
    } else {
      this.projectStore.add(payload).subscribe({
        next: () => this.closed.emit(), // 👇 Cierra modal en lugar de navegar
        error: (err) => console.error(err),
      })
    }
  }

  assignClient(){
    if(!this.projectId) return;

    const clientId = this.form.value.clientId;
    this.projectStore.assignClient(this.projectId, clientId!).subscribe();
  }

  assignTeam(){
    if(!this.projectId) return;

    const teamId = this.form.value.teamId;
    this.projectStore.assignTeam(this.projectId, teamId!).subscribe();
  }

  onClose(): void {
    this.closed.emit();
  }

}
