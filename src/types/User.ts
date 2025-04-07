
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string; // Changed to be required to match other usage
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  banned_until?: string | null;
  avatarUrl?: string;
}
