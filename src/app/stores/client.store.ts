import { inject, Injectable, signal } from "@angular/core";
import { ClientData } from "../interfaces/client.interface";
import { ClientService } from "../services/client";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ClientStore{
  private _clients = signal<ClientData[]>([]);
  clients = this._clients.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  clientService = inject(ClientService);

  loadAll(){
    this._loading.set(true);
    this.clientService.loadAll().pipe(
      tap({
        next: (res) => {
          this._clients.set(res);
          this._loading.set(false);
        },
        error: () => this._loading.set(false),
      })
    ).subscribe();
  }

  create(client: Partial<ClientData>){
    return this.clientService.create(client).pipe(
      tap((client)=> this._clients.update((curr)=> [client, ...curr])
    ));
  }

  update(id: number, payload: Partial<ClientData>){
      return this.clientService.update(id, payload).pipe(
        tap((client)=> this._clients.update(curr => curr.map(c => c.id === client.id ? client : c)))
      );
  }

  delete(id: number){
     return this.clientService.delete(id).pipe(
      tap(()=> this._clients.update(curr=> curr.filter(c => c.id !== id)))
    );
  }
}
