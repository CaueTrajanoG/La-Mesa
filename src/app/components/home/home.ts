import { Component, computed, inject, signal } from '@angular/core';
import { Comanda } from '../comanda/comanda';
import { ApiClient, Order, Product } from '../../services/api-client';

@Component({
  selector: 'home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  protected data = inject(ApiClient);
  //contém todas as comandas abertas
  allOrders = signal<Order[]>([]);
 

  //esse método é executado sempre que o projeto é iniciado
  ngOnInit(){
    this.loadOrders();    
  }

  loadOrders() {
    this.data.getOrders().subscribe({
      next: (orders) => this.allOrders.set(orders),
      error: (err) => console.error('Erro ao carregar orders:', err)
    });
  }


}
