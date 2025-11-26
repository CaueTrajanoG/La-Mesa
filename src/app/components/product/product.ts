import { Component } from '@angular/core';

export interface product{
  id?:number,
  name:string
  price:number
}

@Component({
  selector: 'component-product',
  imports: [],
  templateUrl: './product.html',
  styleUrl: './product.css',
})

export class Product {

}
