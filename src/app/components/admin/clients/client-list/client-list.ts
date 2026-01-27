import { Component, inject, OnInit, signal } from '@angular/core';
import { ClientStore } from '../../../../stores/client.store';
import { ClientData } from '../../../../interfaces/client.interface';
import { Router, RouterLink } from '@angular/router';
import { Loader } from "../../../shared/loader/loader";
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-client-list',
  imports: [Loader, RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss'
})
export class ClientList implements OnInit{
  private clientStore = inject(ClientStore);
  router = inject(Router);

  clients = this.clientStore.clients;
  loading = this.clientStore.loading;

  displayedColumns: string[] = ['name', 'email', 'phone', 'company', 'actions'];

  ngOnInit(): void {
    this.clientStore.loadAll();
  }

  edit(client: ClientData){
      this.router.navigateByUrl(`/admin/client/edit/${client.id}`);
  }

  remove(id: number){
    if (!confirm('¿Deseas eliminar el cliente?')) return;
    this.clientStore.delete(id).subscribe();
  }

}
