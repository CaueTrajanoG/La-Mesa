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

  //por enquanto está enviando essa order para o sb,mas depois
  //ira mandar os dados coletados do modal
  orderTest:Order = {
    "numero":4,
    "products":[{"id":1,"quantity":2}]
  }  
  postOrder(){  
    return this.data.postOrder(this.orderTest).subscribe({
      next: () => console.log("Enviado"),
      error: err => console.error(err)
    });
  }


}
