
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Gift, CreditCard } from 'lucide-react';

const ClubCommercial: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-team-blue mb-4">Support the Club</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our community and help Banks o' Dee FC continue to grow and develop.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Membership */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            className="card-premium bg-white p-6 rounded-lg"
          >
            <div className="w-16 h-16 bg-team-blue/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <ShieldCheck className="w-8 h-8 text-team-blue" />
            </div>
            
            <h3 className="text-xl font-bold text-center mb-4">Membership</h3>
            
            <p className="text-gray-600 mb-6 text-center">
              Become an official member of Banks o' Dee FC and enjoy exclusive benefits and privileges.
            </p>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Priority ticket access
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                10% discount at club shop
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Exclusive members events
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Digital membership card
              </li>
            </ul>
            
            <div className="text-center">
              <p className="text-2xl font-bold mb-2">£60<span className="text-sm font-normal text-gray-600">/year</span></p>
              <a 
                href="/membership" 
                className="inline-block bg-team-blue text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors btn-hover-effect"
              >
                Join Now
              </a>
            </div>
          </motion.div>
          
          {/* Club Shop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-premium bg-white p-6 rounded-lg"
          >
            <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Gift className="w-8 h-8 text-accent-500" />
            </div>
            
            <h3 className="text-xl font-bold text-center mb-4">Club Shop</h3>
            
            <p className="text-gray-600 mb-6 text-center">
              Show your support with the latest Banks o' Dee FC merchandise. Perfect for matchdays and everyday wear.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png" 
                  alt="Home Kit" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 bg-gray-50">
                  <p className="text-sm font-medium">2024/25 Home Kit</p>
                  <p className="text-xs text-gray-500">£45.00</p>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png" 
                  alt="Training Jacket" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 bg-gray-50">
                  <p className="text-sm font-medium">Training Jacket</p>
                  <p className="text-xs text-gray-500">£35.00</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <a 
                href="/shop" 
                className="inline-block bg-team-blue text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors btn-hover-effect"
              >
                Visit Shop
              </a>
            </div>
          </motion.div>
          
          {/* Donations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card-premium bg-white p-6 rounded-lg"
          >
            <div className="w-16 h-16 bg-secondary-300/30 rounded-full flex items-center justify-center mb-4 mx-auto">
              <CreditCard className="w-8 h-8 text-secondary-800" />
            </div>
            
            <h3 className="text-xl font-bold text-center mb-4">Support Fund</h3>
            
            <p className="text-gray-600 mb-6 text-center">
              Help secure the future of Banks o' Dee FC. Your donations directly support our development programs.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm mb-4">
                Your donations help us with:
              </p>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-team-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Youth academy development
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-team-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Stadium improvements
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-team-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Community outreach programs
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-team-blue mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Training equipment
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <a 
                href="/donate" 
                className="inline-block bg-team-blue text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors btn-hover-effect"
              >
                Donate Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClubCommercial;
