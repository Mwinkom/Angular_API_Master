import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { ErrorHandlerService } from './error-handler.service';
import { CacheService } from './cache.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let cacheService: jasmine.SpyObj<CacheService>;
  let errorHandler: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    const cacheSpy = jasmine.createSpyObj('CacheService', ['get', 'set', 'clear']);
    const errorSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleError', 'retryRequest']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: CacheService, useValue: cacheSpy },
        { provide: ErrorHandlerService, useValue: errorSpy }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheService = TestBed.inject(CacheService) as jasmine.SpyObj<CacheService>;
    errorHandler = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get posts from cache if available', () => {
    const mockPosts = [{ id: 1, title: 'Test Post' }];
    const mockResponse = { body: mockPosts, headers: {} };
    cacheService.get.and.returnValue(mockResponse);

    service.getPosts(1, 10).subscribe(response => {
      expect(response.body).toEqual(mockPosts);
    });

    expect(cacheService.get).toHaveBeenCalledWith('posts-page-1-limit-10');
    httpMock.expectNone('https://jsonplaceholder.typicode.com/posts?_page=1&_limit=10');
  });

  it('should fetch posts from API when not cached', () => {
    const mockPosts = [{ id: 1, title: 'Test Post' }];
    cacheService.get.and.returnValue(null);

    service.getPosts(1, 10).subscribe();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts?_page=1&_limit=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should delete a post', () => {
    service.deletePost(1).subscribe();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a post', () => {
    const postData = { title: 'New Post', body: 'Content' };

    service.createPost(postData).subscribe();

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush({ id: 1, ...postData });
  });
});