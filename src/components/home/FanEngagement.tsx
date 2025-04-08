
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Mail, MessageCircle } from 'lucide-react';

const FanEngagement: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-diagonal opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-team-blue mb-4">Fan Zone</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get involved with Banks o' Dee FC and be part of our community.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Media Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0 }}
            className="card-premium bg-white p-5 rounded-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">Social Media</h3>
                <p className="text-sm text-gray-500">Follow our latest updates</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-4">
              <div className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                  <img 
                    src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png" 
                    alt="Banks o' Dee FC" 
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-semibold text-sm">Banks o' Dee FC</p>
                    <p className="text-xs text-gray-500">@BanksODeeFC · 2h</p>
                  </div>
                </div>
                <p className="text-sm">🎉 Congratulations to our first team on their impressive victory yesterday! Great team performance from everyone involved. #BoDFC</p>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                  <img 
                    src="/lovable-uploads/587f8bd1-4140-4179-89f8-dc2ac1b2e072.png" 
                    alt="Banks o' Dee FC" 
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="font-semibold text-sm">Banks o' Dee FC</p>
                    <p className="text-xs text-gray-500">@BanksODeeFC · 1d</p>
                  </div>
                </div>
                <p className="text-sm">Ticket information for our upcoming Highland League fixture against Formartine United is now available on our website. #BoDFC</p>
              </div>
            </div>
            
            <a href="/social" className="block text-center py-2 text-team-blue font-medium hover:underline">
              Follow Us <ChevronRight className="inline-block w-4 h-4" />
            </a>
          </motion.div>
          
          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card-premium bg-white p-5 rounded-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-500 flex items-center justify-center text-team-blue">
                <Mail className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">Newsletter</h3>
                <p className="text-sm text-gray-500">Stay updated with club news</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Sign up to our newsletter to receive the latest news, match information, ticket details, and special offers.
            </p>
            
            <form className="mb-4">
              <div className="mb-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-team-blue focus:border-transparent"
                  placeholder="Your email"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-team-blue text-white py-2 rounded-md hover:bg-opacity-90 transition-colors btn-hover-effect"
              >
                Subscribe Now
              </button>
            </form>
            
            <p className="text-xs text-gray-500 text-center">
              We respect your privacy and will never share your information.
            </p>
          </motion.div>
          
          {/* Fan Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card-premium bg-white p-5 rounded-lg"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary-300 flex items-center justify-center text-team-blue">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-lg">Fan Community</h3>
                <p className="text-sm text-gray-500">Join our supporters</p>
              </div>
            </div>
            
            <div className="mb-4 space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-team-blue text-white flex items-center justify-center font-bold text-sm">
                  MS
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Matchday Experience</p>
                  <p className="text-xs text-gray-500">Latest updates for fans</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-accent-500 text-team-blue flex items-center justify-center font-bold text-sm">
                  SF
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Supporters Forum</p>
                  <p className="text-xs text-gray-500">Have your say</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="h-8 w-8 rounded-full bg-secondary-300 text-team-blue flex items-center justify-center font-bold text-sm">
                  YA
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Youth Academy</p>
                  <p className="text-xs text-gray-500">Support our youth teams</p>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <a href="/community" className="block text-center py-2 text-team-blue font-medium hover:underline">
              Join Our Community <ChevronRight className="inline-block w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FanEngagement;
