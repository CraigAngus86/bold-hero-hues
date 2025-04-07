
// Export TeamMember and MemberType from types directly
import { TeamMember } from '@/types/team';
// Define MemberType here since it's not exported from teamStore
export type MemberType = 'player' | 'staff' | 'coach' | 'official' | 'management';
// Re-export from teamStore.ts 
export { useTeamStore } from './teamStore';
export type { TeamMember };
export { MemberType };
