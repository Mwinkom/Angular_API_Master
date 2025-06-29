import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-post-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})

export class PostDetailComponent implements OnInit {
  post: any;
  comments: any[] = [];
  errorMessage: string = "";
  isLoading: boolean = true;

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute,
    private router: Router,
    private cache: CacheService){}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"));

    this.apiService.getPost(id).subscribe({
      next: (data) => {
        this.post = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
      }
    });

    this.apiService.getComments(id).subscribe({
      next: (data) => this.comments = data,
      error: (err) => this.errorMessage = err.message
    });
  }

  deletePost(): void {
    if (!this.post?.id) return;
    
    if (confirm('Are you sure you want to delete this post?')) {
      this.apiService.deletePost(this.post.id).subscribe({
        next: () => {
          this.cache.clear();
          this.router.navigate(['/'], { state: { successMessage: 'Post deleted successfully!' } });
        },
        error: (err) => this.errorMessage = err.message
      });
    }
  }
}
