import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { noProfanityValidator } from '../../validators/no-profanity.validator';
import { BANNED_WORDS } from '../../constants/banned_words';
import { ActivatedRoute } from '@angular/router';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-post-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.scss'
})

export class PostFormComponent implements OnInit {
  postForm!: FormGroup;
  isSubmitting = false;
  successMessage = "";
  errorMessage = "";
  isEditMode = false;
  postId: number | null = null;

  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private cache: CacheService){}

  ngOnInit(): void {
    this.postId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.postId;

    this.postForm = this.fb.group({
      title : ['', [Validators.required, Validators.minLength(5), noProfanityValidator(BANNED_WORDS)]],
      body: ['', [Validators.required, Validators.minLength(10), noProfanityValidator(BANNED_WORDS)]]
    });

    if (this.isEditMode){
      this.apiService.getPost(this.postId).subscribe({
        next: (post) => this.postForm.patchValue(post),
        error: (err) => this.errorMessage = err.message
      });
    }
  }

  onSubmit(): void{
    if(this.postForm.invalid || this.postForm.pending) return;

    this.isSubmitting = true;
    const postData = this.postForm.value;

    const request$ = this.isEditMode 
    ? this.apiService.updatePost(this.postId!, postData)
    : this.apiService.createPost(postData);

    request$.subscribe({
      next: () => {
        // Clear cache to ensure fresh data is loaded
        this.cache.clear();
        this.successMessage = this.isEditMode
        ? 'Post updated successfully!'
        : 'Post created successfully!';
        this.router.navigate(['/'], { state: { successMessage: `${this.successMessage}` } });
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isSubmitting = false;
      }
    });
  }
}
