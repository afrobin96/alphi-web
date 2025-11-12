import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientData } from '../../../../interfaces/client.interface';
import { ClientStore } from '../../../../stores/client.store';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientForm {
  private fb = inject(FormBuilder);
  private clientStore = inject(ClientStore);

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    company: [''],
  });

  onSubmit(){
    if(this.form.valid){
      this.clientStore.create(this.form.value);
      this.form.reset();
    }
  }
}
