
import { Sponsor, SponsorDisplaySettings, SponsorDocument, SponsorCommunication, SponsorTier } from '@/types/sponsors';
import { supabase } from '@/integrations/supabase/client';

// Mock sponsors data
const mockSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Example Sponsor 1',
    logo_url: 'https://example.com/logo1.png',
    website_url: 'https://example.com',
    tier: 'platinum',
    description: 'A platinum sponsor',
    is_active: true,
    display_order: 1
  },
  {
    id: '2',
    name: 'Example Sponsor 2',
    logo_url: 'https://example.com/logo2.png',
    website_url: 'https://example2.com',
    tier: 'gold',
    description: 'A gold sponsor',
    is_active: true,
    display_order: 2
  }
];

export const getSponsors = async () => {
  try {
    // In a real implementation, this would fetch from Supabase
    // For now, return mock data
    return {
      success: true,
      data: mockSponsors,
      error: null
    };
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return {
      success: false,
      data: [],
      error: 'Failed to fetch sponsors'
    };
  }
};

export const getSponsorById = async (id: string) => {
  try {
    // Mock implementation
    const sponsor = mockSponsors.find(s => s.id === id);
    
    if (!sponsor) {
      return {
        success: false,
        error: 'Sponsor not found'
      };
    }
    
    return {
      success: true,
      data: sponsor
    };
  } catch (error) {
    console.error('Error fetching sponsor:', error);
    return {
      success: false,
      error: 'Failed to fetch sponsor'
    };
  }
};

export const createSponsor = async (data: Omit<Sponsor, 'id'>) => {
  try {
    // Mock implementation
    const newSponsor = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: newSponsor
    };
  } catch (error) {
    console.error('Error creating sponsor:', error);
    return {
      success: false,
      error: 'Failed to create sponsor'
    };
  }
};

export const updateSponsor = async (id: string, data: Partial<Sponsor>) => {
  try {
    // Mock implementation
    const sponsorIndex = mockSponsors.findIndex(s => s.id === id);
    
    if (sponsorIndex === -1) {
      return {
        success: false,
        error: 'Sponsor not found'
      };
    }
    
    const updatedSponsor = {
      ...mockSponsors[sponsorIndex],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: updatedSponsor
    };
  } catch (error) {
    console.error('Error updating sponsor:', error);
    return {
      success: false,
      error: 'Failed to update sponsor'
    };
  }
};

// Documents
export const createSponsorDocument = async (data: Omit<SponsorDocument, 'id'>) => {
  try {
    // Mock implementation
    const newDocument = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: newDocument
    };
  } catch (error) {
    console.error('Error creating sponsor document:', error);
    return {
      success: false,
      error: 'Failed to create sponsor document'
    };
  }
};

export const fetchSponsorDocuments = async (sponsorId: string) => {
  try {
    // Mock implementation
    return {
      success: true,
      data: [
        {
          id: '1',
          name: 'Contract',
          sponsor_id: sponsorId,
          file_path: 'sponsors/documents/contract.pdf',
          document_type: 'contract',
          upload_date: new Date().toISOString()
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching sponsor documents:', error);
    return {
      success: false,
      data: [],
      error: 'Failed to fetch sponsor documents'
    };
  }
};

export const downloadSponsorDocumentUrl = (filePath: string) => {
  // Mock implementation
  return `https://example.com/documents/${filePath}`;
};

// Communications
export const createSponsorCommunication = async (data: Omit<SponsorCommunication, 'id'>) => {
  try {
    // Mock implementation
    const newCommunication = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: newCommunication
    };
  } catch (error) {
    console.error('Error creating sponsor communication:', error);
    return {
      success: false,
      error: 'Failed to create sponsor communication'
    };
  }
};

export const fetchSponsorCommunications = async (sponsorId: string) => {
  try {
    // Mock implementation
    return {
      success: true,
      data: [
        {
          id: '1',
          sponsor_id: sponsorId,
          date: new Date().toISOString(),
          type: 'email',
          subject: 'Sponsorship Renewal',
          content: 'Discussion about renewing sponsorship',
          created_by: 'Admin',
          created_at: new Date().toISOString()
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching sponsor communications:', error);
    return {
      success: false,
      data: [],
      error: 'Failed to fetch sponsor communications'
    };
  }
};
