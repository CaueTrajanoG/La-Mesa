import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Comanda {
  numero: number;
  produtos: { [key: number]: number }; // { produtoId: quantidade }
  total: number;
}

@Component({
  selector: 'app-comanda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comanda.html',
  styleUrls: ['./comanda.css']
})
export class ComandaComponent {
  @Input() comanda!: Comanda;
  @Input() produtos: any[] = []; 
  @Output() editar = new EventEmitter<Comanda>();
  @Output() pagamento = new EventEmitter<Comanda>();

  getProdutosTexto(): string {
    const itens = [];
    for (const [produtoId, quantidade] of Object.entries(this.comanda.produtos)) {
      if (quantidade > 0) {
        const produto = this.produtos.find(p => p.id === Number(produtoId));
        if (produto) {
          itens.push(`${quantidade}x ${produto.nome} `);
        }
      }
    }
    return itens.join(' | ') || 'Nenhum produto';
  }

  editarComanda() {
    this.editar.emit(this.comanda);
  }

  abrirPagamento() {
    this.pagamento.emit(this.comanda);
  }
}