import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = `${environment.apiUrl}/posts`;

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  getPost(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getComments(postId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${postId}/comments`).pipe(
      catchError(this.handleError)
    );
  }

  createPost(postData: {title: string, body: string}): Observable<any> {
    return this.http.post(this.baseUrl, postData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMsg = `Client-side error: ${error.error.message}`;
    } else {
      errorMsg = `Server returned code ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}
