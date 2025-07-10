import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Login } from '../models/login';
import { Register } from '../models/register';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly storageKeyToken = 'token';
  private readonly storageKeyUser = 'user';

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  get currentUserValue(): User | null {
    return this.currentUserSource.value;
  }

  // Load user from localStorage on app start
  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.storageKeyToken);
    const userJson = localStorage.getItem(this.storageKeyUser);

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSource.next(user);
      } catch {
        this.logout(); // Clear corrupted data
      }
    }
  }

  // Log in and store user
  login(dto: Login) {
    return this.http.post<User>(`${environment.apiUrl}/account/login`, dto).pipe(
      map(user => {
        this.storeUser(user);
        return user;
      })
    );
  }

  // Register and store user
  register(dto: Register) {
    return this.http.post<User>(`${environment.apiUrl}/account/register`, dto).pipe(
      map(user => {
        this.storeUser(user);
        return user;
      })
    );
  }

  // Logout and clear storage
  logout(): void {
    localStorage.removeItem(this.storageKeyToken);
    localStorage.removeItem(this.storageKeyUser);
    this.currentUserSource.next(null);
  }

  // Check if user has admin role
  get isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.roles?.includes('Admin') ?? false;
  }

  // Save token + user to localStorage
  private storeUser(user: User): void {
    localStorage.setItem(this.storageKeyToken, user.token);
    localStorage.setItem(this.storageKeyUser, JSON.stringify(user));
    this.currentUserSource.next(user);
  }
}
