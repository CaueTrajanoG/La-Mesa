import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Comanda } from '../components/comanda/comanda';
import { environment } from '../../environments/environment.development';


export interface Produto {
  id?: number;
  quantity: number;
}

export interface Order {
  id?: number;
  numero: number;
  produtos: Produto[]
}

@Injectable({
  providedIn: 'root',
})

export class ApiClient {
  private apiClient = inject(HttpClient);
  private readonly _apiUrl = 'http://localhost:8080/dashboard/all';
  private productURL = `http://localhost:8080/dashboard/all`;

  //GEt
  getOrders(): Observable<Order[]>{
    return this.apiClient.get<Order[]>(this._apiUrl);
  }
  
  //busca apenas 1 comanda
  getOrder(numero: number): Observable<Order>{
    const newUrl = `${this._apiUrl}?numero=eq.${numero}&limit=1`;
    return this.apiClient.get<Order[]>(newUrl).pipe(
        map(res => res[0]),
        catchError(this.handleError)
      )
  }

  getProducts(): Observable<Produto[]>{
    return this.apiClient.get<Produto[]>(this.productURL).pipe(
        catchError(this.handleError)
      )
  }

  //POST
  postOrder(order: Order){
    delete order.id; 
    // removendo id para criar no banco com autoincrement
    return this.apiClient.post(this._apiUrl, order).pipe(
        catchError(this.handleError)
      )
  }

  //PATCH
  pathOrder(order: Order){
    const numeroCmd = order.numero
   
    const newUrl = `${this._apiUrl}?numero=eq.${numeroCmd}`
    return this.apiClient.patch(newUrl, 
      {//body
        products : order.produtos   
      }).pipe(
        catchError(this.handleError)
      )  
  }

  //Delete
  deleteOrder(id:number){
    const newUrl = `${this._apiUrl}?numero=eq.${id}`;
    return this.apiClient.delete<Order[]>(newUrl).pipe(
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
