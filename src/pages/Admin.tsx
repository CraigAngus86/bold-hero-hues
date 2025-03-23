
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DataScraperControl from '@/components/admin/DataScraperControl';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-team-blue mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 mb-8">Manage website data and settings</p>
          
          <DataScraperControl />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
