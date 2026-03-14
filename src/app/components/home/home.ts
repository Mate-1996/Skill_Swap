import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PlatformService, PlatformStats } from '../../services/platform.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  stats: PlatformStats | null = null;

  constructor(private readonly platformService: PlatformService) {
    this.platformService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
