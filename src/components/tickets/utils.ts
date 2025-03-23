
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

export const getTicketTypeName = (type: string) => {
  switch(type) {
    case 'adult': return 'Adult';
    case 'concession': return 'Concession (Over 65 / Student)';
    case 'under16': return 'Under 16';
    case 'family': return 'Family (2 Adults + 2 U16)';
    default: return type;
  }
};
