import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ComandaComponent } from '../comanda/comanda';

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

interface Comanda {
  numero: number;
  produtos: { [produtoId: number]: number };
  total: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ComandaComponent
  ]
})
export class HomeComponent {
  currentPage = 'home';

  produtos: Produto[] = [
    { id: 1, nome: 'Hambúrguer', preco: 25 },
    { id: 2, nome: 'Batata Frita', preco: 12 },
    { id: 3, nome: 'Refrigerante', preco: 8 },
  ];

  comandas: Comanda[] = [];

  modalAberto = false;
  modalPagamentoAberto = false;

  comandaEditando: Comanda | null = null;
  comandaParaPagamento: Comanda | null = null;

  novaComanda: Comanda = this.criarComandaVazia();

  criarComandaVazia(): Comanda {
    return { numero: 0, produtos: {}, total: 0 };
  }

  abrirModal() {
    this.comandaEditando = null;
    this.novaComanda = this.criarComandaVazia();
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
  }

  aumentarQuantidade(produtoId: number) {
    this.novaComanda.produtos[produtoId] =
      (this.novaComanda.produtos[produtoId] || 0) + 1;
    this.calcularTotal();
  }

  diminuirQuantidade(produtoId: number) {
    if (!this.novaComanda.produtos[produtoId]) return;

    this.novaComanda.produtos[produtoId]--;
    if (this.novaComanda.produtos[produtoId] === 0) {
      delete this.novaComanda.produtos[produtoId];
    }
    this.calcularTotal();
  }

  calcularTotal() {
    let total = 0;
    for (const id in this.novaComanda.produtos) {
      const produto = this.produtos.find(p => p.id === +id);
      const qtd = this.novaComanda.produtos[+id];
      if (produto) total += produto.preco * qtd;
    }
    this.novaComanda.total = total;
  }

  get total() {
    return this.novaComanda.total;
  }

  salvarComanda() {
    if (this.comandaEditando) {
      Object.assign(this.comandaEditando, this.novaComanda);
    } else {
      this.comandas.push({ ...this.novaComanda });
    }
    this.fecharModal();
  }

  editarComanda(comanda: Comanda) {
    this.comandaEditando = comanda;
    this.novaComanda = JSON.parse(JSON.stringify(comanda));
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
    if (!this.comandaParaPagamento) return;
    this.comandas = this.comandas.filter(c => c !== this.comandaParaPagamento);
    this.fecharModalPagamento();
  }

  getProdutosLista(produtos: { [id: number]: number }): string[] {
    const lista: string[] = [];
    for (const id in produtos) {
      const produto = this.produtos.find(p => p.id === +id);
      if (produto) {
        lista.push(`${produto.nome} x${produtos[+id]} - R$ ${(produto.preco * produtos[+id]).toFixed(2)}`);
      }
    }
    return lista;
  }
}
