
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FilterOption<T = string> {
  id: string;
  label: string;
  value: T;
}

export interface SortOption {
  id: string;
  label: string;
  value: string;
  direction: 'asc' | 'desc';
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  progress?: number;
  error?: string;
  uploaded_at: string;
}
