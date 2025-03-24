
import { Input as UIInput } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';

// This is a simple re-export to handle the missing import in ImageManager.tsx
// We're reexporting the component to avoid circular dependencies
export const Input = UIInput;
