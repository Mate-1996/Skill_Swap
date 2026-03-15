import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: 'open' | 'in_progress' | 'completed';
  owner: {
    id: number;
    name: string;
    username: string;
    rating_avg: number;
  };
  freelancer?: {
    id: number;
    name: string;
    username: string;
  };
  created_at: string;
}

export interface SearchFilters {
  category?: string;
  status?: 'open' | 'in_progress' | 'completed';
  min_budget?: number;
}

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  private readonly API_URL = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(private readonly http: HttpClient) {}

  // Search jobs with optional filters (public endpoint)
  searchJobs(filters: SearchFilters): Observable<Job[]> {
    return this.http.post<Job[]>(`${this.API_URL}/jobs/search`, filters);
  }

  // Get specific job details (requires auth)
  getJobById(jobId: string | number): Observable<Job> {
    return this.http.get<Job>(`${this.API_URL}/jobs/${jobId}`);
  }

  // Create a new job (requires auth)
  createJob(jobData: {
    title: string;
    description: string;
    budget: number;
    category: string;
  }): Observable<Job> {
    return this.http.post<Job>(`${this.API_URL}/jobs`, jobData);
  }

  // Update job (requires auth, owner only)
  updateJob(
    jobId: number,
    updates: {
      title?: string;
      description?: string;
      budget?: number;
      category?: string;
      status?: string;
    }
  ): Observable<Job> {
    return this.http.patch<Job>(`${this.API_URL}/jobs/${jobId}`, updates);
  }

  // Get jobs created by logged-in user (requires auth)
  getMyPostings(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.API_URL}/jobs/my-postings`);
  }

  // Mark job as completed (requires auth)
  completeJob(jobId: number): Observable<Job> {
    return this.http.patch<Job>(`${this.API_URL}/jobs/${jobId}/complete`, {});
  }
}
