import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Job, JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-my-postings',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-postings.html',
  styleUrl: './my-postings.scss'
})
export class MyPostingsComponent {
  jobs: Job[] = [];
  errorMessage = '';

  constructor(private readonly jobsService: JobsService) {
    this.jobsService.getMyPostings().subscribe({
      next: (res) => {
        this.jobs = res;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to load postings';
      }
    });
  }
}