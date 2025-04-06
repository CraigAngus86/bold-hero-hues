
import { z } from 'zod';

// Define form schema for new user
export const userFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  role: z.string(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  isActive: z.boolean().default(true)
});

export type UserFormValues = z.infer<typeof userFormSchema>;

// Mock user data
export const mockUsers = [
  { id: '1', name: 'John Smith', email: 'john@banksofdee.com', role: 'Admin', isActive: true },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@banksofdee.com', role: 'Editor', isActive: true },
  { id: '3', name: 'Mike Wilson', email: 'mike@banksofdee.com', role: 'Viewer', isActive: false },
];
