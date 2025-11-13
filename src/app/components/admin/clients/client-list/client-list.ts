import { Component, inject, OnInit } from '@angular/core';
import { ClientStore } from '../../../../stores/client.store';

@Component({
  selector: 'app-client-list',
  imports: [],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss'
})
export class ClientList implements OnInit{
  private clientStore = inject(ClientStore);
  clients = this.clientStore.clients;
  loading = this.clientStore.loading;

  ngOnInit(): void {
    this.clientStore.loadAll();
  }

  deleteClient(id:number){
    if (!confirm('¿Deseas eliminar el cliente?')) return;
    this.clientStore.delete(id);
  }

}
