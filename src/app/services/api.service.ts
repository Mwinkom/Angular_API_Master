import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) {}

  getPosts(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(
      this.errorHandler.retryRequest(),
      catchError(this.errorHandler.handleError)
    );
  }

  getPost(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      this.errorHandler.retryRequest(),
      catchError(this.errorHandler.handleError)
    );
  }

  getComments(postId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${postId}/comments`).pipe(
      this.errorHandler.retryRequest(),
      catchError(this.errorHandler.handleError)
    );
  }

  createPost(postData: {title: string, body: string}): Observable<any> {
    return this.http.post(this.baseUrl, postData).pipe(
      catchError(this.errorHandler.handleError)
    );
  }

  updatePost(id: number, postData: {title: string, body: string}): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, postData).pipe(
      catchError(this.errorHandler.handleError)
    );
  }
}
