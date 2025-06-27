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
      errorMsg = `Client-side error: ${error.error.message}`;
    } else {
      errorMsg = `Server returned code ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMsg));
  }
}