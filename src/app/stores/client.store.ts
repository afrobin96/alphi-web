import { inject, Injectable, signal } from "@angular/core";
import { ClientData } from "../interfaces/client.interface";
import { ClientService } from "../services/client";

@Injectable({
  providedIn: 'root',
})
export class ClientStore{
  clients = signal<ClientData[]>([]);

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  error = signal<string | null>(null);

  clientService = inject(ClientService);

  loadAll(){
    this._loading.set(true);
    this.clientService.loadAll().subscribe({
      next: (data) => {
        this.clients.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this.error.set('Error cargando los clientes');
        console.log(err);
        this._loading.set(false);
      }
    });
  }

  create(client: Partial<ClientData>){
    this._loading.set(true);
    this.clientService.create(client).subscribe({
      next: ()=> {
        this.loadAll();
      },
      error: (err) => {
        this.error.set('Error creando el cliente');
        console.log(err);
        this._loading.set(false);
      }
    });
  }

  delete(id: number){
    this._loading.set(true);
    this.clientService.delete(id).subscribe({
      next: ()=> {
        this.loadAll();
      },
      error: (err) => {
        this.error.set('Error eliminando el cliente');
        console.log(err);
        this._loading.set(false);
      }
    })
  }
}
