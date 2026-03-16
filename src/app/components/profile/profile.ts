import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { ReviewsService, Review } from '../../services/reviews.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  user: User | null = null;
  reviews: Review[] = [];
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly reviewsService: ReviewsService
  ) {
    const username = this.route.snapshot.paramMap.get('username') ?? '';

    this.authService.getUserByUsername(username).subscribe({
      next: (res) => {
        this.user = res;
        this.reviewsService.getUserReviews(res.id as any).subscribe({
          next: (reviews) => { this.reviews = reviews; },
          error: () => {}
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.error ?? 'User not found.';
      }
    });
  }
}