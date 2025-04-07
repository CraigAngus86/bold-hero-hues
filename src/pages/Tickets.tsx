
import { Helmet } from 'react-helmet-async';

const Tickets = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Tickets</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-team-blue mb-6">Tickets</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Ticket information and sales coming soon...</p>
      </div>
    </div>
  );
};

export default Tickets;
