import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';

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
    private route: ActivatedRoute){}

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
}
