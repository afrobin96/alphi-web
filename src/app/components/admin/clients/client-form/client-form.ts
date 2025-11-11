import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../../services/client';
import { ClientData } from '../../../../interfaces/client.interface';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientForm {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
  });

  onSubmit(){
    if(this.form.valid){
      this.clientService.create(this.form.value as ClientData)
    }
  }
}
