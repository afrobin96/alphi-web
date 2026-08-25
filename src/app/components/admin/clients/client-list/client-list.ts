import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ClientStore } from '../../../../stores/client.store';
import { ClientData } from '../../../../interfaces/client.interface';
import { Router } from '@angular/router';
import { Loader } from '../../../shared/loader/loader';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ClientForm } from "../client-form/client-form";

@Component({
  selector: 'app-client-list',
  imports: [Loader, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule, ClientForm],
  templateUrl: './client-list.html',
  styleUrl: './client-list.scss',
})
export class ClientList implements OnInit {
  private clientStore = inject(ClientStore);
  router = inject(Router);

  clients = this.clientStore.clients;
  loading = this.clientStore.loading;

  // null = modal cerrado | undefined = crear nuevo | ClientData = editar
  selectedClient = signal<ClientData | null | undefined>(undefined);

  displayedColumns: string[] = ['name', 'email', 'phone', 'company', 'actions'];

  dataSource = new MatTableDataSource<ClientData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.clients();
    });

    // Solo se filtra por nombre.
    this.dataSource.filterPredicate = (client: ClientData, filter: string) => {
      return (client.name ?? '').toLowerCase().includes(filter);
    };
  }

  ngOnInit(): void {
    this.clientStore.loadAll();
  }

  openClientModal(): void {
    this.selectedClient.set(null); // null = modo crear
  }

  editClientModal(client: ClientData): void {
    this.selectedClient.set(client); // cliente = modo editar
  }

  closeModal(): void {
    this.selectedClient.set(undefined); // undefined = cerrado
    this.clientStore.loadAll();
  }

  isModalOpen(): boolean {
    return this.selectedClient() !== undefined;
  }

  remove(id: number) {
    if (!confirm('¿Deseas eliminar el cliente?')) return;
    this.clientStore.delete(id).subscribe();
  }

  filterClientsTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
