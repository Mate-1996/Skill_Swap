import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { PostJobComponent } from './components/post-job/post-job';
import { JobsListingComponent } from './components/jobs-listing/jobs-listing';
import { JobDetailsComponent } from './components/job-details/job-details';
import { MyPostingsComponent } from './components/my-postings/my-postings';
import { MyBidsComponent } from './components/my-bids/my-bids';
import { ProfileComponent } from './components/profile/profile';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  { path: 'jobs', component: JobsListingComponent },
  { path: 'post-job', component: PostJobComponent, canActivate: [authGuard] },
  { path: 'jobs/:id', component: JobDetailsComponent, canActivate: [authGuard] },
  { path: 'my-postings', component: MyPostingsComponent, canActivate: [authGuard] },
  { path: 'my-bids', component: MyBidsComponent, canActivate: [authGuard] },
  { path: 'profile/:username', component: ProfileComponent },
  { path: '**', redirectTo: '' }
];
