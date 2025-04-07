
import { Helmet } from 'react-helmet-async';

const Stadium = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Spain Park</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-team-blue mb-6">Spain Park</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Stadium information coming soon...</p>
      </div>
    </div>
  );
};

export default Stadium;
