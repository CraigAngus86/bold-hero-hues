
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { TeamMember } from '@/types/team';

interface TeamMemberFormProps {
  member: Partial<TeamMember>;
  onSubmit: (data: Partial<TeamMember>) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ member, onSubmit, isSubmitting, error }) => {
  const [formData, setFormData] = useState<Partial<TeamMember>>(member);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      const numValue = value === '' ? undefined : Number(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name?.trim()) errors.name = 'Name is required';
    if (!formData.member_type) errors.member_type = 'Member type is required';
    
    // If it's a player, validate jersey number if provided
    if (formData.member_type === 'player' && formData.jersey_number !== undefined) {
      if (formData.jersey_number < 0 || formData.jersey_number > 99) {
        errors.jersey_number = 'Jersey number must be between 0 and 99';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-3">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={validationErrors.name ? 'border-red-500' : ''}
          />
          {validationErrors.name && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="member_type" className="block text-sm font-medium text-gray-700 mb-1">
            Member Type <span className="text-red-500">*</span>
          </label>
          <select
            id="member_type"
            name="member_type"
            value={formData.member_type || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${validationErrors.member_type ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select member type</option>
            <option value="player">Player</option>
            <option value="management">Management</option>
            <option value="official">Official</option>
          </select>
          {validationErrors.member_type && (
            <p className="text-red-500 text-sm mt-1">{validationErrors.member_type}</p>
          )}
        </div>
        
        {formData.member_type === 'player' && (
          <>
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <Input
                id="position"
                name="position"
                value={formData.position || ''}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="jersey_number" className="block text-sm font-medium text-gray-700 mb-1">
                Jersey Number
              </label>
              <Input
                id="jersey_number"
                name="jersey_number"
                type="number"
                min={0}
                max={99}
                value={formData.jersey_number === undefined ? '' : formData.jersey_number}
                onChange={handleChange}
                className={validationErrors.jersey_number ? 'border-red-500' : ''}
              />
              {validationErrors.jersey_number && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.jersey_number}</p>
              )}
            </div>
          </>
        )}
        
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
            Nationality
          </label>
          <Input
            id="nationality"
            name="nationality"
            value={formData.nationality || ''}
            onChange={handleChange}
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Biography
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="flex items-center">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={formData.is_active !== false}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
            Active Member
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default TeamMemberForm;
