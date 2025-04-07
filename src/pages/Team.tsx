
import { Helmet } from 'react-helmet-async';

const Team = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Team & Management</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-team-blue mb-6">Team & Management</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Team page content coming soon...</p>
      </div>
    </div>
  );
};

export default Team;
