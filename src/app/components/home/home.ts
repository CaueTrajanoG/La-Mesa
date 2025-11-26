import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComandaComponent, Comanda } from '../comanda/comanda';

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

  
  produtos: Produto[] = [
  { id: 1, nome: 'Coca Cola', preco: 8.00 },
  { id: 2, nome: 'Batata Frita', preco: 12.00 },
  { id: 3, nome: 'Hambúrguer', preco: 25.00 }
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
      this.comandas.push(comandaData);
    }

    this.fecharModal();
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
      
      this.comandas = this.comandas.filter(c => c.numero !== this.comandaParaPagamento!.numero);
      alert(`Pagamento gerado para comanda ${this.comandaParaPagamento.numero}! Total: R$ ${this.comandaParaPagamento.total.toFixed(2)}`);
      this.fecharModalPagamento();
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