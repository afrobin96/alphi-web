import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../../services/project';
import { ProjectStore } from '../../../../stores/project.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { subscribe } from 'diagnostics_channel';
import { ClientStore } from '../../../../stores/client.store';
import { TeamStore } from '../../../../stores/team.store';

@Component({
  selector: 'app-projects-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './projects-form.html',
  styleUrl: './projects-form.scss'
})
export class ProjectsForm implements OnInit{

  fb = inject(FormBuilder);
  projectService = inject(ProjectService);
  projectStore = inject(ProjectStore);
  route = inject(ActivatedRoute);
  router = inject(Router);
  httpClient = inject(HttpClient);
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
  clients = this.clientStore.clients;
  teams = this.teamStore.teams;

  ngOnInit(): void {
    this.clientStore.loadAll();
    this.teamStore.loadAll();

    const id = +this.route.snapshot.paramMap.get('id')!;

    if(id){
      this.editing = true;
      this.projectId = id;
      this.projectService.get(id).subscribe(project =>{
          this.form.patchValue({
            name: project.name,
            description: project.description,
            clientId: project.client?.id || null,
            teamId: project.team?.id || null,

          });
      });
    }
  }

  save(){
    const formValue = this.form.value;
    if(this.editing && this.projectId){
      this.projectStore.update(this.projectId, {...formValue, name: formValue.name || ''}).subscribe(()=>{
        this.router.navigateByUrl('admin/projects');
      });
    } else {
      this.projectStore.add({...formValue, name: formValue.name || ''}).subscribe(() => {
        this.router.navigateByUrl('admin/projects');
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
    this.projectStore.assignClient(this.projectId, teamId!).subscribe();
  }

}
