import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})

export class PostListComponent implements OnInit {
  posts: any[] = [];
  errorMessage: string = "";
  successMessage: string = "";

  constructor(private apiService: ApiService, private router: Router){}

  ngOnInit(): void {
    // Check for success message from navigation state
    if (history.state?.successMessage) {
      this.successMessage = history.state.successMessage;
      // Clear from history state to prevent reappearing on back navigation
      history.replaceState({ ...history.state, successMessage: null }, '');
      setTimeout(() => this.successMessage = '', 3000)}; 

    this.apiService.getPosts().subscribe({
      next: (data) => this.posts = data,
      error: (error) => this.errorMessage = error.message
    });
  }
}
