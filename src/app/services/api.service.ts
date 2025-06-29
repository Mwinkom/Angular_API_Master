import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlerService } from './error-handler.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient, 
              private errorHandler: ErrorHandlerService,      
              private cache: CacheService) {}

  getPosts(page: number = 1, limit: number = 10): Observable<any> {
    const cacheKey = `posts-page-${page}-limit-${limit}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return of(new HttpResponse({ body: cached.body, headers: cached.headers }));
    }

    const url = `${this.baseUrl}?_page=${page}&_limit=${limit}`
    return this.http.get(url, {observe: 'response'}).pipe(
      tap(response => this.cache.set(cacheKey, {
        body: response.body,
        headers: response.headers
      })), // Cache the response

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
