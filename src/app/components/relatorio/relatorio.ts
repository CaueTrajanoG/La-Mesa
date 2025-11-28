import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ComandaPaga {
  numero: number;
  produtos: { [key: number]: number };
  total: number;
  data_pagamento: string;
}


const MAPA_PRODUTOS: { [key: number]: { nome: string; preco: number } } = {
  1: { nome: 'Coca Cola', preco: 8.00 },
  2: { nome: 'Batata Frita', preco: 12.00 },
  3: { nome: 'Hot dog', preco: 12.00 },
  4: { nome: 'Pizza', preco: 30.00 }
};

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './relatorio.html',
  styleUrls: ['./relatorio.css']
})
export class RelatorioComponent implements OnInit {
  comandasPagas: ComandaPaga[] = [];

  ngOnInit() {
    this.carregarComandasPagas();
  }

  carregarComandasPagas() {
    const comandasPagasSalvas = localStorage.getItem('la-mesa-comandas-pagas');
    if (comandasPagasSalvas) {
      this.comandasPagas = JSON.parse(comandasPagasSalvas);
    }
  }

  getProdutosTexto(produtos: { [key: number]: number }): string {
    const itens: string[] = [];
    for (const [produtoId, quantidade] of Object.entries(produtos)) {
      if (quantidade > 0) {
        const produtoInfo = MAPA_PRODUTOS[Number(produtoId)];
        if (produtoInfo) {
          itens.push(`${quantidade}x ${produtoInfo.nome}`);
        } else {
          itens.push(`${quantidade}x Produto ${produtoId}`);
        }
      }
    }
    return itens.join(', ') || 'Nenhum produto';
  }

  getTotalVendas(): number {
    return this.comandasPagas.reduce((total, comanda) => total + comanda.total, 0);
  }

  getMediaPorComanda(): number {
    return this.comandasPagas.length > 0 ? this.getTotalVendas() / this.comandasPagas.length : 0;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR');
  }

  getDataAtual(): string {
    return new Date().toLocaleString('pt-BR');
  }
}