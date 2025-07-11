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
      this.currentUserSource.next(JSON.parse(user));
    }
  }

  login(values: Login) {
    return this.http.post<User>(this.baseUrl + 'account/login', values).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
        return user;
      })
    );
  }

  register(values: Register) {
    return this.http.post<User>(this.baseUrl + 'account/register', values).pipe(
      map(user => {
        if (user) {
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
  return this.http.get<User>(this.baseUrl + 'account/current-user').pipe(
    map(user => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
      }
      return user;
    })
  );
}
updateAddress(address: Address) {
  return this.http.put<User>(this.baseUrl + 'account/address', address).pipe(
    map((user) => {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user);
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
