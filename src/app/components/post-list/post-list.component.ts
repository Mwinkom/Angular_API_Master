import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})

export class PostListComponent implements OnInit {
  posts: any[] = [];
  errorMessage: string = "";

  constructor(private apiService: ApiService){}

  ngOnInit(): void {
    this.apiService.getPosts().subscribe({
      next: (data) => this.posts = data,
      error: (error) => this.errorMessage = error.message
    });
  }
}
