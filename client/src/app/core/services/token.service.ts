import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode'; // ✅ FIXED

export interface DecodedToken {
  exp: number;
  iat: number;
  email: string;
  nameid: string;
  unique_name: string;
  role: string | string[];
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private decodeToken(): DecodedToken | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getTokenExpiration(): Date | null {
    const decoded = this.decodeToken();
    return decoded ? new Date(decoded.exp * 1000) : null;
  }

  isTokenExpired(): boolean {
    const expiration = this.getTokenExpiration();
    return !expiration || expiration.getTime() < Date.now();
  }

  getUserRoles(): string[] {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.role) return [];
    return Array.isArray(decoded.role) ? decoded.role : [decoded.role];
  }

  isAdmin(): boolean {
    return this.getUserRoles().includes('Admin');
  }

  getUserEmail(): string | null {
    const decoded = this.decodeToken();
    return decoded?.email ?? null;
  }

  getUserId(): string | null {
    const decoded = this.decodeToken();
    return decoded?.nameid ?? null;
  }
}
