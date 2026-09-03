import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { TaskStore } from '../../../../stores/task.store';
import { Router } from '@angular/router';
import { Loader } from '../../../shared/loader/loader';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaymentStore } from '../../../../stores/payment.store';
import { TaskData } from '../../../../interfaces/task.interface';
import { ModalPayment } from '../modal-payment/modal-payment';
import { PaymentData } from '../../../../interfaces/payments.interface';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TasksForm } from '../tasks-form/tasks-form';

@Component({
  selector: 'app-tasks-list',
  imports: [
    Loader,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    ModalPayment,
    MatPaginatorModule,
    TasksForm,
  ],
  templateUrl: './tasks-list.html',
  styleUrl: './tasks-list.scss',
})
export class TasksList implements OnInit {
  paymentStore = inject(PaymentStore);
  taksStore = inject(TaskStore);
  router = inject(Router);

  loading = this.taksStore.loading;
  tasks = this.taksStore.tasks;
  payments = this.paymentStore.payments;

  selectedPayment = signal<PaymentData | null>(null);

  // null = modal cerrado | undefined = crear nuevo | ProjectData = editar
  selectedTask = signal<TaskData | null | undefined>(undefined);

  displayedColumns: string[] = [
    'title',
    'value',
    'state',
    'project',
    'member',
    'actions',
  ];

  dataSource = new MatTableDataSource<TaskData>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    effect(() => {
      this.dataSource.data = this.tasks();
    });

    // Solo se filtra por nombre.
    this.dataSource.filterPredicate = (task: TaskData, filter: string) => {
      return (task.title ?? '').toLowerCase().includes(filter);
    };
  }

  // Map de taskId -> paymentId para búsqueda rápida en el template
  taskPaymentMap = computed(() => {
    const map = new Map<number, PaymentData>();
    this.payments().forEach((payment) => {
      payment.tasks?.forEach((task) => {
        if (task.id !== undefined) {
          map.set(task.id, payment);
        }
      });
    });

    return map;
  });

  ngOnInit(): void {
    this.taksStore.load();
    this.paymentStore.load();
  }

  openTaskModal(): void {
    this.selectedTask.set(null); // null = modo crear
  }

  editTaskModal(task: TaskData): void {
    this.selectedTask.set(task); // proyecto = modo editar
  }

  closeModal(): void {
    this.selectedTask.set(undefined); // undefined = cerrado
    this.paymentStore.load();
  }

  isModalOpen(): boolean {
    return this.selectedTask() !== undefined;
  }

  getPaymentId(taskId: number): PaymentData | undefined {
    return this.taskPaymentMap().get(taskId);
  }

  openPaymentModal(taskId: number): void {
    const payment = this.getPaymentId(taskId);
    if (payment) this.selectedPayment.set(payment);
  }

  closePaymentModal(): void {
    this.selectedPayment.set(null);
  }

  delete(id: number): void {
    if (!confirm('¿Deseas eliminar la tarea?')) return;
    this.taksStore.delete(id).subscribe();
  }

  assignMember(taskId: number, memberId: number): void {
    this.taksStore.assignMember(taskId, Number(memberId)).subscribe();
  }

  assignProject(taskId: number, projectId: number): void {
    this.taksStore.assignProject(taskId, Number(projectId)).subscribe();
  }

  changeStatus(taskId: number, status: string): void {
    this.taksStore.changeStatus(taskId, status).subscribe();
  }

  goToCreatePayment(): void {
    this.router.navigateByUrl(`/admin/payments/new`);
  }

  filterTasksTable(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
