import { Component } from '@angular/core';

@Component({
  selector: 'home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  title = 'la-mesa';  
  
  tables: any[] = []; 
  activeFilter: string = 'all';
  selectedTable: any = null;
  showOrdersModal: boolean = false;
  showPaymentModal: boolean = false;

  constructor() {
    
    this.tables = [
      { id: 1, name: '01', occupied: true, orders: [] },
      { id: 2, name: '02', occupied: false, orders: [] },
      { id: 3, name: '03', occupied: true, orders: [] },
      { id: 4, name: '04', occupied: false, orders: [] },
      { id: 5, name: '05', occupied: true, orders: [] },
      { id: 6, name: '06', occupied: false, orders: [] }
    ];
  }

  
  onFilterChange(filter: string): void {
    this.activeFilter = filter;
    console.log('Filtro alterado:', filter);
  }

  onViewOrders(tableId: number): void {
    console.log('Ver pedidos da mesa:', tableId);
    this.selectedTable = this.tables.find(table => table.id === tableId);
    this.showOrdersModal = true;
  }

  onToggleStatus(tableId: number): void {
    console.log('Alternar status da mesa:', tableId);
    const table = this.tables.find(table => table.id === tableId);
    if (table) {
      table.occupied = !table.occupied;
    }
  }

  onAddOrder(data: any): void {
    console.log('Adicionar pedido:', data);
  }

  onPayBill(tableId: number): void {
    console.log('Fechar conta da mesa:', tableId);
    this.showOrdersModal = false;
    this.showPaymentModal = true;
  }

  onGeneratePayment(tableId: number): void {
    console.log('Gerar pagamento da mesa:', tableId);
    this.showPaymentModal = false;
    alert('Pagamento realizado com sucesso! Mesa liberada.');
  }

  onCloseOrdersModal(): void {
    this.showOrdersModal = false;
    this.selectedTable = null;
  }

  onClosePaymentModal(): void {
    this.showPaymentModal = false;
    this.selectedTable = null;
  }
}
