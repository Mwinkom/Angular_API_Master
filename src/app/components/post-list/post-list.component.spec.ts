import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PostListComponent } from './post-list.component';
import { ApiService } from '../../services/api.service';
import { CacheService } from '../../services/cache.service';
import { AuthService } from '../../services/auth.service';

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let cacheService: jasmine.SpyObj<CacheService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockPosts = [
    { id: 1, title: 'Test Post 1', body: 'Content 1' },
    { id: 2, title: 'Test Post 2', body: 'Content 2' }
  ];

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['getPosts']);
    const cacheSpy = jasmine.createSpyObj('CacheService', ['clear']);
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    activatedRoute = {
      queryParamMap: of(new Map([['page', '1']]))
    };

    await TestBed.configureTestingModule({
      imports: [PostListComponent],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: CacheService, useValue: cacheSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    cacheService = TestBed.inject(CacheService) as jasmine.SpyObj<CacheService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    apiService.getPosts.and.returnValue(of({ body: mockPosts, headers: { get: () => '100' } }));
    expect(component).toBeTruthy();
  });

  it('should load posts on init', () => {
    apiService.getPosts.and.returnValue(of({ body: mockPosts, headers: { get: () => '100' } }));
    
    component.ngOnInit();
    
    expect(apiService.getPosts).toHaveBeenCalledWith(1, 10);
    expect(component.posts).toEqual(mockPosts);
    expect(component.totalPosts).toBe(100);
  });

  it('should handle API error', () => {
    apiService.getPosts.and.returnValue(throwError(() => new Error('API Error')));
    
    component.ngOnInit();
    
    expect(component.errorMessage).toBe('API Error');
  });

  it('should clear cache and refresh posts', () => {
    apiService.getPosts.and.returnValue(of({ body: mockPosts, headers: { get: () => '100' } }));
    component.currentPage = 2;
    
    component.clearCache();
    
    expect(cacheService.clear).toHaveBeenCalled();
    expect(apiService.getPosts).toHaveBeenCalledWith(2, 10);
  });

  it('should navigate to page with query params', () => {
    component.goToPage(3);
    
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: { page: 3 },
      queryParamsHandling: 'merge'
    });
  });

  it('should call auth service methods', () => {
    component.login();
    component.logout();
    
    expect(authService.login).toHaveBeenCalled();
    expect(authService.logout).toHaveBeenCalled();
  });
});
