
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      
      <h1 className="text-6xl font-bold text-team-blue mb-6">404</h1>
      <h2 className="text-3xl font-semibold mb-8">Page Not Found</h2>
      
      <p className="text-xl text-gray-600 mb-8">
        We couldn't find the page you're looking for.
      </p>
      
      <Link 
        to="/" 
        className="inline-block bg-team-blue text-white font-medium px-6 py-3 rounded hover:bg-opacity-90 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
