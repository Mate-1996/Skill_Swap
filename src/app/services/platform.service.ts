import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PlatformStats {
  total_users: number;
  active_jobs: number;
  total_value_moved: number;
}

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  private readonly BASE_URL = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(private readonly http: HttpClient) {}

  getStats(): Observable<PlatformStats> {
    return this.http.get<PlatformStats>(`${this.BASE_URL}/platform/stats`);
  }
}