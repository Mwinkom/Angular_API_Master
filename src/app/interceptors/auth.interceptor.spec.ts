import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';
import { of } from 'rxjs';

describe('AuthInterceptor', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let mockNext: jasmine.Spy<HttpHandlerFn>;
  let mockRequest: HttpRequest<any>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockNext = jasmine.createSpy('HttpHandlerFn').and.returnValue(of({}));
    mockRequest = new HttpRequest('GET', '/test');
  });

  it('should add Authorization header when token exists', () => {
    authService.getToken.and.returnValue('test-token');

    TestBed.runInInjectionContext(() => {
      AuthInterceptor(mockRequest, mockNext);
    });

    expect(mockNext).toHaveBeenCalledWith(
      jasmine.objectContaining({
        headers: jasmine.objectContaining({
          lazyUpdate: jasmine.arrayContaining([
            jasmine.objectContaining({
              name: 'Authorization',
              value: 'Bearer test-token'
            })
          ])
        })
      })
    );
  });

  it('should not add Authorization header when no token', () => {
    authService.getToken.and.returnValue(null);

    TestBed.runInInjectionContext(() => {
      AuthInterceptor(mockRequest, mockNext);
    });

    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });

  it('should call next handler', () => {
    authService.getToken.and.returnValue('test-token');

    TestBed.runInInjectionContext(() => {
      AuthInterceptor(mockRequest, mockNext);
    });

    expect(mockNext).toHaveBeenCalled();
  });
});