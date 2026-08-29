import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ClientStore } from '../../../../stores/client.store';
import { ClientService } from '../../../../services/client';
import { ClientData } from '../../../../interfaces/client.interface';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientForm implements OnInit{

  client = input<ClientData | null>(null);
  closed  = output<void>();

  private fb = inject(FormBuilder);
  clientStore = inject(ClientStore);
  clientService = inject(ClientService);

  editing = false;
  clientId?: number;

  // Validador personalizado para solo números en el teléfono
  private numbersOnlyValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const isNumeric = /^[0-9]*$/.test(control.value);
    return isNumeric ? null : { numbersOnly: true };
  }

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required,this.numbersOnlyValidator.bind(this)]],
    company: [''],
  });

  ngOnInit(): void {
    const client = this.client();

    if(client){
      this.editing = true;
      this.clientId = client.id;
      this.form.patchValue({
            name: client.name,
            email: client.email,
            phone: client.phone,
            company: client.company

          });
    }
  }

  onSubmit(){
    if (this.form.invalid) return;

    const formValue = this.form.value;

    if(this.editing && this.clientId){
      this.clientStore.update(this.clientId, formValue).subscribe({
        next: () => this.closed.emit(), // 👇 Cierra modal en lugar de navegar
        error: (err) => console.error(err),
      });
    } else {
      this.clientStore.create(formValue).subscribe({
        next: () => this.closed.emit(), // 👇 Cierra modal en lugar de navegar
        error: (err) => console.error(err),
      })
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}
