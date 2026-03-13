import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class SignupComponent {
  name = '';
  username = '';
  email = '';
  password = '';
  bio = '';
  skillsInput = '';
  errorMessage = '';
  suggestedUsername = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit() {
    this.errorMessage = '';
    this.suggestedUsername = '';

    const skills = this.skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.authService.register(this.name, this.username, this.email, this.password, this.bio, skills).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error.error;
        if (err.error.suggested_username) {
          this.suggestedUsername = err.error.suggested_username;
        }
      }
    });
  }

  useSuggested() {
    this.username = this.suggestedUsername;
    this.suggestedUsername = '';
  }
}