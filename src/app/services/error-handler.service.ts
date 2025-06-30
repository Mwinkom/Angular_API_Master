import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, retry, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  retryRequest(retries: number = 3, delay: number = 1000) {
    return retry({
      count: retries,
      delay: (error: HttpErrorResponse) => {
        // Only retry on server errors (5xx) or network errors
        if (error.status >= 500 || error.status === 0) {
          return timer(delay);
        }
        return throwError(() => error);
      }
    });
  }

  handleError(error: HttpErrorResponse) {
    let errorMsg = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMsg = `Network error: ${error.error.message}`;
    } else if (error.status === 0) {
      // Network error or CORS issue
      errorMsg = 'Unable to connect to server. Please check your connection.';
    } else if (error.status === 404) {
      errorMsg = 'The requested resource was not found.';
    } else if (error.status >= 500) {
      errorMsg = 'Server error occurred. Please try again later.';
    } else {
      errorMsg = `Error ${error.status}: ${error.message || 'Something went wrong'}`;
    }
    
    console.error('HTTP Error:', error);
    return throwError(() => new Error(errorMsg));
  }
}