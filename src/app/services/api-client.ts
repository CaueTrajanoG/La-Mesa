import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';

export interface Product {
  id?: number;
  name?: string;
  price?: number;
  quantity: number;
}
export interface Order {
  id?: number;
  numero: number;
  products: Product[];
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})

export class ApiClient {
  private apiClient = inject(HttpClient);
  private readonly _apiUrl = 'https://lfvjoiwqvgvcvljfyngk.supabase.co/rest/v1/Orders'
  private readonly productURL = 'https://lfvjoiwqvgvcvljfyngk.supabase.co/rest/v1/Products'
  private readonly _apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdmpvaXdxdmd2Y3ZsamZ5bmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4Mzk5MjMsImV4cCI6MjA3OTQxNTkyM30.eaPFsTY7GtBB0i3tqlNKP8u_atngnKsL_PyfY7e5BVw'
  
  private headers(){
    return{
      apikey: this._apiKey,
      Authorization: `Bearer ${this._apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    }
  }

  //GEt
  getOrders(): Observable<Order[]>{
    return this.apiClient.get<Order[]>(this._apiUrl,
      {
        headers: this.headers()
      }).pipe(
        catchError(this.handleError)
      )
  }

  //busca apenas 1 comanda
  getOrder(numero: number): Observable<Order>{
    const newUrl = `${this._apiUrl}?numero=eq.${numero}&limit=1`;
    return this.apiClient.get<Order[]>(newUrl,
      {
        headers: this.headers()
      }).pipe(
        map(res => res[0]),
        catchError(this.handleError)
      )
  }

  getProducts(): Observable<Product[]>{
    return this.apiClient.get<Product[]>(this.productURL,
      {
        headers: this.headers()
      }).pipe(
        catchError(this.handleError)
      )
  }

  //POST
  postOrder(order: Order){
    delete order.id; 
    // removendo id para criar no banco com autoincrement
    return this.apiClient.post(this._apiUrl, order, {
        headers: this.headers()
      }).pipe(
        catchError(this.handleError)
      )
  }
  //PATCH
  pathOrder(){

  }
  //Delete
  deleteOrder(id:number){
    const newUrl = `${this._apiUrl}?numero=eq.${id}`;
    return this.apiClient.delete<Order[]>(newUrl, {
      headers: this.headers()
    }).pipe(
      catchError(this.handleError)
    )
  }

  //Tratando erros
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error("ERRO NA API SUPABASE:");
    console.error("Status:", error.status);
    console.error("Mensagem:", error.message);
    console.error("Body:", error.error);
    console.error("Headers:", error.headers);

  return throwError(() => new Error(error.message || "Erro desconhecido"));
  }
}
