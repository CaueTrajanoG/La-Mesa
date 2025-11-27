import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Produto {
  id: number;
  nome: string;
  preco: number;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductComponent {
  produtos: Produto[] = [
  { id: 1, nome: 'Coca Cola', preco: 8.00 },
  { id: 2, nome: 'Batata Frita', preco: 12.00 },
  { id: 3, nome: 'Hambúrguer', preco: 25.00 }
];

  novoProduto: Partial<Produto> = {};
  modalAberto: boolean = false;

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.novoProduto = {};
  }

  adicionarProduto() {
    if (this.novoProduto.nome && this.novoProduto.preco) {
      const novoId = this.produtos.length > 0 ? Math.max(...this.produtos.map(p => p.id)) + 1 : 1;
      
      this.produtos.push({
        id: novoId,
        nome: this.novoProduto.nome,
        preco: this.novoProduto.preco
      });
      
      this.fecharModal();
    }
  }

  removerProduto(id: number) {
    this.produtos = this.produtos.filter(p => p.id !== id);
  }

  editarProduto(produto: Produto) {
    this.novoProduto = { ...produto };
    this.modalAberto = true;
  }

  salvarEdicao() {
    if (this.novoProduto.id && this.novoProduto.nome && this.novoProduto.preco) {
      const index = this.produtos.findIndex(p => p.id === this.novoProduto.id);
      if (index !== -1) {
        this.produtos[index] = {
          id: this.novoProduto.id,
          nome: this.novoProduto.nome,
          preco: this.novoProduto.preco
        };
      }
      this.fecharModal();
    }
  }
}