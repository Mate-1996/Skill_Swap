import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsService } from '../../services/jobs.service';
import { ProposalsService } from '../../services/proposals.service';
import { ReviewsService } from '../../services/reviews.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './job-details.html',
  styleUrl: './job-details.scss'
})
export class JobDetailsComponent implements OnInit {
  job: any = null;
  proposals: any[] = [];
  isLoading = true;
  errorMessage = '';
  currentUserId: number | null = null;
  isJobOwner = false;

  // For submitting proposal
  proposalForm = {
    price: '',
    cover_letter: ''
  };
  isSubmittingProposal = false;

  // For completing job
  isCompleting = false;

  // For review
  reviewForm = {
    rating: '',
    comment: ''
  };
  isSubmittingReview = false;
  showReviewForm = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly jobsService: JobsService,
    private readonly proposalsService: ProposalsService,
    private readonly reviewsService: ReviewsService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  loadJob() {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (!jobId) {
      this.errorMessage = 'Invalid job ID';
      this.isLoading = false;
      return;
    }
    
    // Make REAL API call
    this.jobsService.getJobById(jobId).subscribe({
      next: (response) => {
        this.job = response;
        this.isJobOwner = this.job.owner.id === this.currentUserId;
        
        // If I'm the owner, load proposals
        if (this.isJobOwner) {
          this.loadProposals(jobId);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Job not found';
        this.isLoading = false;
      }
    });
  }

  getCurrentUser() { 
    const token = this.authService.getToken();
    if (token) { 
      this.authService.getCurrentUser().subscribe({
        next: (user: any) => {
          this.currentUserId = user.id;
          this.loadJob();
        },
        error: () => {
      this.currentUserId = null;
      this.loadJob();
    }
      });
    }
  }

  loadProposals(jobId: string) {
    this.proposalsService.getProposalsForJob(jobId).subscribe({
      next: (response) => {
        this.proposals = response;
        this.isLoading = false;
      },
      error: (err) => {
        // Real API error
        this.errorMessage = err.error?.error || 'Failed to load proposals';
        this.isLoading = false;
      }
    });
  }

  submitProposal() {
    if (!this.proposalForm.price || !this.proposalForm.cover_letter) {
      this.errorMessage = 'Price and cover letter are required';
      return;
    }

    this.isSubmittingProposal = true;

    // Make REAL API call
    this.proposalsService.submitProposal(this.job.id, {
      price: Number(this.proposalForm.price),
      cover_letter: this.proposalForm.cover_letter
    }).subscribe({
      next: (response) => {
        this.router.navigate(['/my-proposals']);
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to submit proposal';
        this.isSubmittingProposal = false;
      }
    });
  }

  acceptProposal(proposalId: number) {
    if (confirm('Accept this proposal?')) {
      // Make REAL API call
      this.proposalsService.acceptProposal(proposalId).subscribe({
        next: (response) => {
          this.loadJob();
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Failed to accept proposal';
        }
      });
    }
  }

  completeJob() {
    if (confirm('Mark job as completed?')) {
      this.isCompleting = true;

      
      this.jobsService.completeJob(this.job.id).subscribe({
        next: (response) => {
          this.job.status = 'completed';
          this.showReviewForm = true;
          this.isCompleting = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Failed to complete job';
          this.isCompleting = false;
        }
      });
    }
  }

  submitReview() {
    if (!this.reviewForm.rating) {
      this.errorMessage = 'Rating is required';
      return;
    }

    this.isSubmittingReview = true;

    // Make REAL API call
    this.reviewsService.submitReview(this.job.id, {
      target_id: this.job.freelancer.id, // or job.owner.id
      rating: Number(this.reviewForm.rating),
      comment: this.reviewForm.comment
    }).subscribe({
      next: (response) => {
        this.showReviewForm = false;
        alert('Review submitted!');
        this.isSubmittingReview = false;
      },
      error: (err) => {
        // Real API errors: "Can't review yourself", "Already reviewed", etc.
        this.errorMessage = err.error?.error || 'Failed to submit review';
        this.isSubmittingReview = false;
      }
    });
  }
}