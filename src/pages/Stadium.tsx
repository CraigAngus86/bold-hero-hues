
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { MapPin, Clock, Car, Bus, Train, Utensils, ExternalLink, Phone, Map } from 'lucide-react';

const Stadium = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-team-blue mb-4">Spain Park Stadium</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Home of Banks o' Dee FC since 1924, Spain Park is located on the banks of the River Dee in Aberdeen.
            </p>
          </motion.div>
          
          {/* Stadium Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative h-80 md:h-96 rounded-lg overflow-hidden mb-12"
          >
            <img 
              src="/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png" 
              alt="Spain Park Stadium" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-white font-bold text-lg flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Spain Park, Aberdeen AB11 6JJ
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-white font-bold text-lg flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Capacity: 2,500
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Stadium Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="md:col-span-2"
            >
              <h2 className="text-2xl font-bold text-team-blue mb-4">About Spain Park</h2>
              <div className="prose max-w-none text-gray-700">
                <p>
                  Spain Park has been the home of Banks o' Dee FC since 1924. The ground is located 
                  on the south side of the River Dee in Aberdeen and provides a picturesque setting for football matches.
                </p>
                <p>
                  The stadium features a main covered stand with seating for approximately 500 spectators, 
                  with additional standing areas around the perimeter of the pitch. Recent upgrades include 
                  improved floodlighting, renovated changing facilities, and a new artificial playing surface 
                  to ensure matches can be played throughout the Scottish winter.
                </p>
                <p>
                  Spain Park has hosted numerous memorable matches over the years, including cup finals and 
                  high-profile friendlies against professional teams. The stadium's intimate atmosphere creates 
                  an excellent environment for supporters to get close to the action and cheer on Banks o' Dee FC.
                </p>
              </div>
              
              <h2 className="text-2xl font-bold text-team-blue mt-8 mb-4">Facilities</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>FIFA approved 3G artificial playing surface</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>Covered main stand with 500 seats</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>Standing areas around all sides of the pitch</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>Modern changing facilities</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>Club shop and ticket office</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>Refreshment areas with hot and cold food/drinks</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-team-blue rounded-full mr-2 mt-2"></span>
                  <span>Free parking for supporters (limited spaces available)</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-bold text-team-blue mb-4">Match Day Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                      <Utensils className="w-4 h-4 mr-2 text-team-blue" />
                      Refreshments
                    </h4>
                    <p className="text-sm text-gray-600">
                      Hot and cold refreshments are available inside the ground, including hot drinks, pies, and snacks.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-team-blue" />
                      Stadium Opening Times
                    </h4>
                    <p className="text-sm text-gray-600">
                      Gates open 1 hour before kick-off for all matches.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-team-blue" />
                      Contact
                    </h4>
                    <p className="text-sm text-gray-600">
                      For stadium enquiries, please call: 01224 574295
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2 text-team-blue" />
                      Stadium Hire
                    </h4>
                    <p className="text-sm text-gray-600">
                      Spain Park is available for hire for events and matches. Contact the club for details.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a 
                    href="/tickets" 
                    className="block w-full bg-team-blue text-white text-center py-3 rounded-md font-medium hover:bg-team-navy transition-colors"
                  >
                    Buy Match Tickets
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Getting to the Stadium */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-12"
          >
            <h2 className="text-2xl font-bold text-team-blue mb-6 flex items-center">
              <Map className="w-6 h-6 mr-2" />
              Getting to Spain Park
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <Car className="w-5 h-5 mr-2 text-team-blue" />
                  By Car
                </h3>
                <p className="text-gray-600 text-sm">
                  Spain Park is located just off Holburn Street in Aberdeen. Limited free parking is available at the ground on a first-come, first-served basis. Alternative parking is available on surrounding streets, please observe local parking restrictions.
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  <strong>Sat Nav Postcode:</strong> AB11 6JJ
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <Bus className="w-5 h-5 mr-2 text-team-blue" />
                  By Bus
                </h3>
                <p className="text-gray-600 text-sm">
                  Several bus routes serve the area around Spain Park. The First Bus services 1, 2, and 3 stop on Holburn Street, a short walk from the stadium. From Union Street in the city center, services run approximately every 10 minutes.
                </p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg mb-3 flex items-center">
                  <Train className="w-5 h-5 mr-2 text-team-blue" />
                  By Train
                </h3>
                <p className="text-gray-600 text-sm">
                  Aberdeen Railway Station is approximately 1.5 miles from Spain Park. A taxi from the station to the ground takes around 5-10 minutes depending on traffic. Alternatively, bus services are available from Union Street near the station.
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2166.8694370807243!2d-2.119705!3d57.133963!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x488470eebfb2881d%3A0x5db1eb0f4e85a5bd!2sSpain%20Park!5e0!3m2!1sen!2suk!4v1695896352378!5m2!1sen!2suk" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map to Spain Park"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Stadium;
