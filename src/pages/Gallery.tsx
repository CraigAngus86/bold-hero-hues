
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';

const Gallery = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Media Gallery | Banks o' Dee FC</title>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-team-blue">Media Gallery</h1>
          <p className="text-gray-600 mb-8">Photos and videos from matches, events, and more.</p>
          
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-center">
              Full gallery page coming soon!<br />
              Check back for updates.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
