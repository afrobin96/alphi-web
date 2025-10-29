import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../../services/project';
import { ProjectStore } from '../../../../stores/project.store';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-projects-form',
  imports: [ReactiveFormsModule],
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

  // inicialize form
  form = this.fb.group({
    name:['', Validators.required],
    description: [''],
    clientId: [0],
    teamId: [0]
  });

  editing = false;
  projectId?: number;
  clients: any[] = [];
  teams: any[] = [];

  ngOnInit(): void {
    this.httpClient.get<any[]>('/clients').subscribe(r => this.clients = r);
    this.httpClient.get<any[]>('/teams').subscribe(r => this.teams = r);

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
