import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Job, JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-jobs-listing',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './jobs-listing.html',
  styleUrl: './jobs-listing.scss'
})
export class JobsListingComponent {
  jobs: Job[] = [];
  errorMessage = '';

  filterCategory = '';
  filterMinBudget = '';

  constructor(private readonly jobsService: JobsService) {
    this.loadJobs();
  }

  loadJobs() {
    const filters: any = { status: 'open' };
  if (this.filterCategory.trim()) filters.category = this.filterCategory.trim();
  if (this.filterMinBudget) filters.min_budget = Number(this.filterMinBudget);

    this.jobsService.searchJobs(filters).subscribe({
      next: (res) => {
        this.jobs = res;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error.error;
      }
    });
  }

  applyFilters() {
    this.loadJobs();
  }

  clearFilters() {
    this.filterCategory = '';
    this.filterMinBudget = '';
    this.loadJobs();
  }
}