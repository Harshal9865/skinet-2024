import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Login } from '../models/login';
import { Register } from '../models/register';
import { environment } from '../../../environments/environment';
import { Address } from '../models/address';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser: User = JSON.parse(user);
        if (parsedUser && parsedUser.token) {
          this.currentUserSource.next(parsedUser);
        }
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }

  private formatUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`.replace(/([^:]\/)\/+/g, '$1');
  }

  login(values: Login) {
    return this.http.post<User>(this.formatUrl('account/login'), values).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  register(values: Register) {
    return this.http.post<User>(this.formatUrl('account/register'), values).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getCurrentUserFromApi() {
    return this.http.get<User>(this.formatUrl('account/current-user')).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  updateAddress(address: Address) {
    return this.http.put<User>(this.formatUrl('account/address'), address).pipe(
      map(user => {
        if (user && user.token) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSource.value;
  }

  get isAdmin(): boolean {
    return this.currentUserSource.value?.roles?.includes('Admin') ?? false;
  }
}
