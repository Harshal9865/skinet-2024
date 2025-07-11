import { Address } from './address';

export interface User {
  email: string;
  token: string;
  displayName: string;
  roles: string[];
  avatarUrl: string;
  address?: Address; 
}
