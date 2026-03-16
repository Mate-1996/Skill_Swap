import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proposal {
  id: number;
  job_id: number;
  freelancer_id: number;
  freelancer: {
    id: number;
    name: string;
    username: string;
    rating_avg: number;
  };
  job: {
  id: number;
  title: string;
  budget: number;
  status: string;
};
  price: number;
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProposalsService {
  private readonly API_URL = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(private readonly http: HttpClient) {}

  // Submit a proposal for a job (requires auth)
  submitProposal(
    jobId: number,
    proposalData: {
      price: number;
      cover_letter: string;
    }
  ): Observable<Proposal> {
    return this.http.post<Proposal>(
      `${this.API_URL}/jobs/${jobId}/proposals`,
      proposalData
    );
  }

  // Get proposals for a specific job (requires auth, job owner only)
  getProposalsForJob(jobId: string | number): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(
      `${this.API_URL}/jobs/${jobId}/proposals`
    );
  }

  // Accept a proposal (requires auth, job owner only)
  acceptProposal(proposalId: number): Observable<Proposal> {
    return this.http.patch<Proposal>(
      `${this.API_URL}/proposals/${proposalId}/accept`,
      {}
    );
  }

  // Get proposals submitted by logged-in user (requires auth)
  getMyProposals(): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(`${this.API_URL}/proposals/my-bids`);
  }

  // Withdraw a proposal (requires auth, proposal owner only, must be pending)
  withdrawProposal(proposalId: number): Observable<any> {
    return this.http.delete(
      `${this.API_URL}/proposals/${proposalId}`
    );
  }
}
