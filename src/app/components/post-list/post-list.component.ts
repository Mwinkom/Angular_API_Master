import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute ,RouterLink, Router } from '@angular/router';
import { PaginationComponent } from '../pagination/pagination.component';
import { CacheService } from '../../services/cache.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, RouterLink, PaginationComponent],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})

export class PostListComponent implements OnInit {
  posts: any[] = [];
  errorMessage: string = "";
  successMessage: string = "";
  totalPosts = 0;
  currentPage = 1;
  postsPerPage = 10;


  constructor(private apiService: ApiService, 
              private router: Router, 
              private route: ActivatedRoute,
              private cache: CacheService,
              private auth: AuthService){}
              

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
        const page = Number(params.get('page')) || 1
        this.currentPage = page;
        this.fetchPosts(page);
    });

    // Check for success message from navigation state
    if (history.state?.successMessage) {
      this.successMessage = history.state.successMessage;
      // Clear from history state to prevent reappearing on back navigation
      history.replaceState({ ...history.state, successMessage: null }, '');
      setTimeout(() => this.successMessage = '', 3000)}; 
  }

  fetchPosts(page: number) :void {
    this.apiService.getPosts(page, this.postsPerPage).subscribe({
      next: (response) => {
        this.posts = response.body;
        this.totalPosts = Number(response.headers.get('x-total-count') || 0);
      },
      error: (err) => this.errorMessage = err.message
    });
  }

  goToPage(page: number): void {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    })
  }

  clearCache(): void {
    this.cache.clear();
    this.fetchPosts(this.currentPage); // Refresh current page
  }

  login() {
    this.auth.login();
    alert('Logged in!');
  }

  logout() {
    this.auth.logout();
    alert('Logged out!');
  }
}
