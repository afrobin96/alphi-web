import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientStore } from '../../../../stores/client.store';
import { ClientData } from '../../../../interfaces/client.interface';
import { Router, RouterLink } from '@angular/router';
import { Loader } from "../../../shared/loader/loader";

@Component({
  selector: 'app-client-list',
  imports: [Loader, RouterLink],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss'
})
export class ClientList implements OnInit{
  private clientStore = inject(ClientStore);
  router = inject(Router);

  clients = this.clientStore.clients;
  loading = this.clientStore.loading;

  ngOnInit(): void {
    this.clientStore.loadAll();
  }

  edit(client: ClientData){
      this.router.navigateByUrl(`/admin/client/edit/${client.id}`);
  }

  remove(id: number){
    if (!confirm('¿Deseas eliminar el cliente?')) return;
    this.clientStore.delete(id).subscribe;
  }

}
