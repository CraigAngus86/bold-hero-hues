
import { Helmet } from 'react-helmet-async';

const News = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>News</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold text-team-blue mb-6">Latest News</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">News page content coming soon...</p>
      </div>
    </div>
  );
};

export default News;
