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
  currentUserId: string | null = null;
  isJobOwner = false;

  proposalForm = {
    price: '',
    cover_letter: ''
  };
  isSubmittingProposal = false;

  isCompleting = false;

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

  get isFreelancer(): boolean {
    return !!this.job?.freelancer && String(this.job.freelancer.id) === String(this.currentUserId);
  }

  getCurrentUser() {
    const token = this.authService.getToken();
    if (token) {
      this.authService.getCurrentUser().subscribe({
        next: (user: any) => {
          this.currentUserId = String(user.id);
          this.loadJob();
        },
        error: () => {
          this.currentUserId = null;
          this.loadJob();
        }
      });
    } else {
      this.loadJob();
    }
  }

  loadJob() {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (!jobId) {
      this.errorMessage = 'Invalid job ID';
      this.isLoading = false;
      return;
    }

    this.jobsService.getJobById(jobId).subscribe({
      next: (response) => {
        this.job = response;
        this.isJobOwner = String(this.job.owner.id) === String(this.currentUserId);

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

  loadProposals(jobId: string) {
    this.proposalsService.getProposalsForJob(jobId).subscribe({
      next: (response) => {
        this.proposals = response;
        this.isLoading = false;
      },
      error: (err) => {
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
    this.errorMessage = '';

    this.proposalsService.submitProposal(this.job.id, {
      price: Number(this.proposalForm.price),
      cover_letter: this.proposalForm.cover_letter
    }).subscribe({
      next: () => {
        this.isSubmittingProposal = false;
        this.proposalForm = { price: '', cover_letter: '' };
        alert('Proposal submitted successfully!');
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to submit proposal';
        this.isSubmittingProposal = false;
      }
    });
  }

  acceptProposal(proposalId: number) {
    if (!confirm('Accept this proposal?')) return;

    this.proposalsService.acceptProposal(proposalId).subscribe({
      next: () => {
        this.loadJob();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to accept proposal';
      }
    });
  }

  completeJob() {
    if (!confirm('Mark job as completed?')) return;

    this.isCompleting = true;

    this.jobsService.completeJob(this.job.id).subscribe({
      next: () => {
        this.job.status = 'completed';
        this.showReviewForm = false;
        this.isCompleting = false;
        this.loadJob();
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to complete job';
        this.isCompleting = false;
      }
    });
  }

  submitReview() {
    if (!this.reviewForm.rating) {
      this.errorMessage = 'Rating is required';
      return;
    }

    this.isSubmittingReview = true;
    this.errorMessage = '';

    const targetId = this.isJobOwner
      ? this.job.freelancer.id
      : this.job.owner.id;

    this.reviewsService.submitReview(this.job.id, {
      target_id: targetId,
      rating: Number(this.reviewForm.rating),
      comment: this.reviewForm.comment
    }).subscribe({
      next: () => {
        this.showReviewForm = false;
        this.isSubmittingReview = false;
        alert('Review submitted successfully!');
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to submit review';
        this.isSubmittingReview = false;
      }
    });
  }
}