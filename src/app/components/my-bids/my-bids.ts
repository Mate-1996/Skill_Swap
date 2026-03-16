import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Proposal, ProposalsService } from '../../services/proposals.service';

@Component({
  selector: 'app-my-bids',
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bids.html',
  styleUrl: './my-bids.scss'
})
export class MyBidsComponent {
  proposals: Proposal[] = [];
  errorMessage = '';

  constructor(private readonly proposalsService: ProposalsService) {
    this.loadBids();
  }

  loadBids() {
    this.proposalsService.getMyProposals().subscribe({
      next: (res) => {
        this.proposals = res;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Failed to load bids';
      }
    });
  }

  withdraw(proposalId: number) {
    if (!confirm('Withdraw this proposal?')) return;
    this.proposalsService.withdrawProposal(proposalId).subscribe({
      next: () => {
        this.loadBids();
      },
      error: (err) => {
        alert(err.error?.error || 'Failed to withdraw');
      }
    });
  }
}