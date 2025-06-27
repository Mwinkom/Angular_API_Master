import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { noProfanityValidator } from '../../validators/no-profanity.validator';
import { BANNED_WORDS } from '../../constants/banned_words';

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

  constructor(private router: Router, private fb: FormBuilder, private apiService: ApiService){}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title : ['', [Validators.required, Validators.minLength(5), noProfanityValidator(BANNED_WORDS)]],
      body: ['', [Validators.required, Validators.minLength(10), noProfanityValidator(BANNED_WORDS)]]
    });
  }

  onSubmit(): void{
    if(this.postForm.invalid || this.postForm.pending) return;
    this.isSubmitting = true;

    const postData = this.postForm.value;

    this.apiService.createPost(postData).subscribe({
      next: () => {
        this.router.navigate(['/'], { state: { successMessage: 'Post Created Successfully!' } });
      },
      error: (err) => {
        this.errorMessage = err;
        this.isSubmitting = false;
      }
    });
  }
}
