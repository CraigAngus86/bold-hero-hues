
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LeagueTablePage from '@/components/league/LeagueTablePage';

const LeagueTablePageContainer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <LeagueTablePage />
      </div>
      
      <Footer />
    </div>
  );
};

export default LeagueTablePageContainer;
