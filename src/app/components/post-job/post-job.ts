// post-job.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-post-job',
  imports: [FormsModule, CommonModule],
  templateUrl: './post-job.html',
  styleUrl: './post-job.scss'
})
export class PostJobComponent {
  form = {
    title: '',
    description: '',
    budget: '',
    category: ''
  };

  errorMessage = '';
  isSubmitting = false;
  categories = ['Web Development', 'Mobile Development', 'UI/UX Design', 'Writing', 'Video Editing'];

  constructor(
    private readonly jobsService: JobsService,
    private readonly router: Router
  ) {}

  submit() {
    // Validation
    if (!this.form.title || !this.form.description || !this.form.budget || !this.form.category) {
      this.errorMessage = 'All fields are required';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Make REAL API call to POST /jobs
    this.jobsService.createJob({
      title: this.form.title,
      description: this.form.description,
      budget: parseInt(this.form.budget),
      category: this.form.category
    }).subscribe({
      next: (response) => {
        // response = created job object
        this.router.navigate(['/my-jobs']);
      },
      error: (err) => {
        // Real API errors: missing fields, validation errors
        this.errorMessage = err.error?.error || 'Failed to create job';
        this.isSubmitting = false;
      }
    });
  }
}