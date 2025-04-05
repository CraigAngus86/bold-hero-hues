
// Date formatting utility functions
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'short'
  };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export const formatShortDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'short'
  };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export const formatMonthYear = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'long',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};
