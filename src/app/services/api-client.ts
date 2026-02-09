import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { environment } from '../../environments/environment.development'

export interface Produto {
  id: number
  quantity: number
}

export interface Comanda {
  id?: number
  numero: number
  produtos: Produto[]
  aberta: boolean
  createdat?: string
}

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private http = inject(HttpClient)
  private apiUrl = `${environment.apiUrl}/dashboard`

  getComandas(): Observable<Comanda[]> {
    return this.http
      .get<Comanda[]>(`${this.apiUrl}/all`)
      .pipe(catchError(this.handleError))
  }

  getComandaById(id: number): Observable<Comanda> {
    return this.http
      .get<Comanda>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError))
  }

  createComanda(comanda: Comanda): Observable<string> {
    return this.http
      .post(`${this.apiUrl}`, comanda, { responseType: 'text' })
      .pipe(catchError(this.handleError))
  }

  updateComanda(id: number, comanda: Comanda): Observable<string> {
    return this.http
      .put(`${this.apiUrl}/${id}`, comanda, { responseType: 'text' })
      .pipe(catchError(this.handleError))
  }

  patchComanda(id: number, comanda: Partial<Comanda>): Observable<string> {
    return this.http
      .patch(`${this.apiUrl}/${id}`, comanda, { responseType: 'text' })
      .pipe(catchError(this.handleError))
  }

  deleteComanda(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError))
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error)
  }
}
