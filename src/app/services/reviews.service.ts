import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Review {
  id: number;
  job_id: number;
  reviewer_id: number;
  target_id: number;
  rating: number;
  comment: string;
  reviewer: {
    id: number;
    name: string;
    username: string;
  };
  target: {
    id: number;
    name: string;
    username: string;
  };
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly API_URL = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(private readonly http: HttpClient) {}

  // Submit a review for a completed job (requires auth)
  submitReview(
    jobId: number,
    reviewData: {
      target_id: number;
      rating: number;
      comment?: string;
    }
  ): Observable<Review> {
    return this.http.post<Review>(
      `${this.API_URL}/jobs/${jobId}/reviews`,
      reviewData
    );
  }

  // Get all reviews for a specific user (public endpoint)
  getUserReviews(userId: number): Observable<Review[]> {
    return this.http.get<Review[]>(
      `${this.API_URL}/reviews/user/${userId}`
    );
  }
}
