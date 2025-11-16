import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientStore } from '../../../../stores/client.store';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../../services/client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientForm implements OnInit{
  private fb = inject(FormBuilder);
  clientStore = inject(ClientStore);
  clientService = inject(ClientService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  httpClient = inject(HttpClient);

  editing = false;
  clientId?: number;
  clients = this.clientService.clients;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
  });

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;

    if(id){
      this.editing = true;
      this.clientId = id;
    }
  }

  onSubmit(){
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if (this.clientId) {
      this.clientStore.update(this.clientId, formValue).subscribe();
      this.router.navigateByUrl('admin/clients');
    } else {
      this.clientStore.create(formValue).subscribe();
      this.router.navigateByUrl('admin/clients');
    }

    this.form.reset();


  }



}
