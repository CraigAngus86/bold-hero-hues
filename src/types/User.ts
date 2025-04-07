
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string; // Make name optional to match auth.User
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
  banned_until?: string | null;
}
