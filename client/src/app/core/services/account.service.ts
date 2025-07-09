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
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

get currentUserValue(): User | null {
  return this.currentUserSource.value;
}


  constructor(private http: HttpClient) {
    this.loadUser();
  }

  loadUser() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        const userObj = JSON.parse(user);
        this.currentUserSource.next(userObj);
      } catch {
        this.logout(); // Cleanup if corrupted
      }
    }
  }

  login(dto: Login) {
    return this.http.post<User>(`${environment.apiUrl}/account/login`, dto).pipe(
      map(user => {
        this.storeUser(user);
        return user;
      })
    );
  }

  register(dto: Register) {
    return this.http.post<User>(`${environment.apiUrl}/account/register`, dto).pipe(
      map(user => {
        this.storeUser(user);
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  get isAdmin(): boolean {
    const user = this.currentUserSource.value;
    return user?.roles.includes('Admin') ?? false;
  }

  private storeUser(user: User) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }
}
