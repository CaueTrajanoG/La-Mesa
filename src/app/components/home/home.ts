import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComandaComponent, Comanda } from '../comanda/comanda';
import { inject, signal } from '@angular/core';
import { ApiClient, Order, Product } from '../../services/api-client';


interface Produto {
  id: number;
  nome: string;
  preco: number;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ComandaComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class HomeComponent {
  currentPage: string = 'home';
  modalAberto: boolean = false;
  modalPagamentoAberto: boolean = false;
  total: number = 0;
  comandaEditando: Comanda | null = null;

  protected data = inject(ApiClient);
  //contém todas as comandas abertas
  allOrders = signal<Order[]>([]); 
  allProducts = signal<Product[]>([]); 
  
  produtos: Produto[] = [
  { id: 1, nome: 'Coca Cola', preco: 8.00 },
  { id: 2, nome: 'Batata Frita', preco: 12.00 },
  { id: 3, nome: 'Hot dog', preco: 12.00 },
  { id: 4, nome: 'Pizza', preco: 30.00 }
];

  novaComanda = {
    numero: null as number | null,
    produtos: {} as { [key: number]: number } 
  };

  comandas: Comanda[] = [];
  comandaParaPagamento: Comanda | null = null;

  setActivePage(page: string) {
    this.currentPage = page;
  }

  ngOnInit(){
    this.loadOrders()
    this.loadProducts()
    this.carregarComandasPagas()
  }

  criaComanda(numeroComanda:number, meusProdutos:any){
    const newID:number = 0;
    const quantidade:number = 0;
    const valor:number = 0

    const lista_produtos: { [key: number]: number } = {};
    
    for (const n of meusProdutos) {
      const newID:number = n.id;
      const quantidade:number = n.quantity;
      lista_produtos[newID] = quantidade;
    }

    const comandaData: Comanda = {
    numero: numeroComanda,
    produtos: lista_produtos,
    total: this.newCalcularTotal(lista_produtos)
  };
    this.comandas.push(comandaData);
  }  

  newCalcularTotal(lista:{ [key: number]: number } = {}) {
    this.total = 0;
    for (const [produtoId, quantidade] of Object.entries(lista)) {
      const produto = this.produtos.find(p => p.id === Number(produtoId));
      if (produto && quantidade > 0) {
        this.total += produto.preco * quantidade;
      }
    }
    return this.total;
  }

  //carrega os produtos cadastrados no database
  loadProducts(){
     this.data.getProducts().subscribe({
      next: (products) => {
        this.allProducts.set(products);
      },
      error: (err) => console.error('Erro ao carregar produtos:', err)            
    }) 
  }

  loadOrders() {
    this.data.getOrders().subscribe({
      next: (orders) => {
        this.allOrders.set(orders);        
        for (const n of this.allOrders()) {
          this.criaComanda(n.numero, n.products);
        }
        this.loadOrder(3)
      },
      error: (err) => console.error('Erro ao carregar orders:', err)      
    });
  }

  loadOrder(numero: number) {
    this.data.getOrder(numero).subscribe({
      next: (order) => {               
        console.log(order.products); 
      },
      error: (err) => console.error('Erro ao carregar orders:', err)      
    });
  }

  abrirModal() {
    this.comandaEditando = null;
    this.limparFormulario();
    this.modalAberto = true;
  }
  
  fecharModal() {
    this.modalAberto = false;
    this.limparFormulario();
    this.comandaEditando = null;
  }


  aumentarQuantidade(produtoId: number) {
    if (!this.novaComanda.produtos[produtoId]) {
      this.novaComanda.produtos[produtoId] = 0;
    }
    this.novaComanda.produtos[produtoId]++;
    this.calcularTotal();
  }

  diminuirQuantidade(produtoId: number) {
    if (this.novaComanda.produtos[produtoId] && this.novaComanda.produtos[produtoId] > 0) {
      this.novaComanda.produtos[produtoId]--;
      this.calcularTotal();
    }
  }

  calcularTotal() {
    this.total = 0;
    for (const [produtoId, quantidade] of Object.entries(this.novaComanda.produtos)) {
      const produto = this.produtos.find(p => p.id === Number(produtoId));
      if (produto && quantidade > 0) {
        this.total += produto.preco * quantidade;
      }
    }
  }

  salvarComanda() {
    if (!this.novaComanda.numero) {
      alert('Por favor, informe o número da comanda!');
      return;
    }

    
    const temProdutos = Object.values(this.novaComanda.produtos).some(quantidade => quantidade > 0);
    if (!temProdutos) {
      alert('Por favor, selecione pelo menos um produto!');
      return;
    }

    const comandaData: Comanda = {
      numero: this.novaComanda.numero,
      produtos: { ...this.novaComanda.produtos },
      total: this.total
    };

    if (this.comandaEditando) {
      
      const index = this.comandas.findIndex(c => c.numero === this.comandaEditando!.numero);
      if (index !== -1) {
        this.comandas[index] = comandaData;
      }
    } else {
      
      const comandaExistente = this.comandas.find(c => c.numero === this.novaComanda.numero);
      if (comandaExistente) {
        alert('Já existe uma comanda com este número!');
        return;
      }


      const productsArray = Object.entries(this.novaComanda.produtos).map(([id, quantity]) => ({
        id: Number(id),
        quantity: quantity
      }));

      let newOrder: Order = {
        numero: this.novaComanda.numero,
        products: productsArray,
      };
      this.data.postOrder(newOrder).subscribe();
    }
    
    this.fecharModal();
    window.location.reload();
  }

  editarComanda(comanda: Comanda) {
    this.comandaEditando = comanda;
    this.novaComanda.numero = comanda.numero;
    this.novaComanda.produtos = { ...comanda.produtos };
    this.calcularTotal();
    this.modalAberto = true;
  }

  abrirModalPagamento(comanda: Comanda) {
    this.comandaParaPagamento = comanda;
    this.modalPagamentoAberto = true;
  }

  fecharModalPagamento() {
    this.modalPagamentoAberto = false;
    this.comandaParaPagamento = null;
  }

  gerarPagamento() {
    if (this.comandaParaPagamento) {
      this.comandasPagas.push(this.comandaParaPagamento);

      this.comandas = this.comandas.filter(c => c.numero !== this.comandaParaPagamento!.numero);  
      this.salvarComandasPagas();
      alert(`Pagamento gerado para comanda ${this.comandaParaPagamento.numero}! Total: R$ ${this.comandaParaPagamento.total.toFixed(2)}`);
      this.fecharModalPagamento();
      
      //método que apaga a order no database após o pagamento
      this.data.deleteOrder(this.comandaParaPagamento!.numero).subscribe();
      window.location.reload();

    }
  }


  // tem q criar uma tabelinha no supabase para salvar as comandas

comandasPagas: Comanda[] = [];

  salvarComandasPagas() {
    localStorage.setItem('la-mesa-comandas-pagas', JSON.stringify(this.comandasPagas));
  }

  carregarComandasPagas() {
    const comandasPagasSalvas = localStorage.getItem('la-mesa-comandas-pagas');
    if (comandasPagasSalvas) {
      this.comandasPagas = JSON.parse(comandasPagasSalvas);
    }
  }

  limparFormulario() {
    this.novaComanda = {
      numero: null,
      produtos: {}
    };
    this.total = 0;
  }

  getProdutoPorId(produtoId: number): Produto | undefined {
    return this.produtos.find(p => p.id === produtoId);
  }

  getProdutosLista(produtos: { [key: number]: number }): string[] {
    const itens: string[] = [];
    for (const [produtoId, quantidade] of Object.entries(produtos)) {
      if (quantidade > 0) {
        const produto = this.getProdutoPorId(Number(produtoId));
        if (produto) {
          itens.push(`${quantidade}x ${produto.nome} - R$ ${(produto.preco * quantidade).toFixed(2)}`);
        }
      }
    }
    return itens;
  }

  getProdutosTexto(produtos: { [key: number]: number }): string {
    const itens: string[] = [];
    for (const [produtoId, quantidade] of Object.entries(produtos)) {
      if (quantidade > 0) {
        const produto = this.getProdutoPorId(Number(produtoId));
        if (produto) {
          itens.push(`${quantidade}x ${produto.nome}`);
        }
      }
    }
    return itens.join(', ') || 'Nenhum produto';
  }
}
