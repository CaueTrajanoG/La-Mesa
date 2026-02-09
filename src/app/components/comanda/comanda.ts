import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comanda',
  standalone: true,
  templateUrl: './comanda.html',
  imports: [CommonModule]
})
export class ComandaComponent {
  @Input() comanda!: any;
  @Input() produtos!: any[];

  @Output() editar = new EventEmitter<any>();
  @Output() pagamento = new EventEmitter<any>();

  editarComanda() {
    this.editar.emit(this.comanda);
  }

  abrirPagamento() {
    this.pagamento.emit(this.comanda);
  }

  getProdutosTexto(): string {
    return Object.entries(this.comanda.produtos || {})
      .map(([id, qtd]: any) => {
        const produto = this.produtos.find(p => p.id === +id);
        return produto ? `${produto.nome} x${qtd}` : '';
      })
      .join(', ');
  }
}
