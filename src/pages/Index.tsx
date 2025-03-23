
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import TeamGrid from '@/components/TeamGrid';
import Footer from '@/components/Footer';
import { ArrowRight, Calendar, Trophy, Users, MapPin } from 'lucide-react';

const mockNews = [
  {
    id: 1,
    title: "Banks o' Dee crowned Highland League Cup Champions",
    excerpt: "The team celebrates with fans after a hard-fought victory in the final, adding another prestigious trophy to the club's growing collection.",
    image: "/lovable-uploads/46e4429e-478d-4098-9cf9-fb6444adfc3b.png",
    date: "April 18, 2023",
    category: "Cup Success"
  },
  {
    id: 2,
    title: "Thrilling victory in crucial league fixture",
    excerpt: "Banks o' Dee forward displays exceptional skill in our latest match, helping the team secure an important three points in our title chase.",
    image: "/lovable-uploads/122628af-86b4-4d7f-bfe3-01d4bf03d053.png",
    date: "March 25, 2023",
    category: "Match Report"
  },
  {
    id: 3,
    title: "Spain Park facilities showcase - The pride of Banks o' Dee",
    excerpt: "Stunning aerial view of our recently upgraded stadium and facilities, situated in a picturesque location alongside the River Dee.",
    image: "/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png",
    date: "February 28, 2023",
    category: "Stadium News"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Quick Links Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <Calendar className="w-6 h-6" />, 
                title: "Fixtures", 
                description: "View upcoming matches and past results", 
                link: "/fixtures",
                color: "from-blue-500 to-blue-600" 
              },
              { 
                icon: <Trophy className="w-6 h-6" />, 
                title: "League Table", 
                description: "Check our position in the Highland League", 
                link: "/table",
                color: "from-emerald-500 to-emerald-600" 
              },
              { 
                icon: <Users className="w-6 h-6" />, 
                title: "Team & Management", 
                description: "Meet the players and coaching staff", 
                link: "/team",
                color: "from-amber-500 to-amber-600" 
              },
              { 
                icon: <MapPin className="w-6 h-6" />, 
                title: "Spain Park", 
                description: "Information about our home ground", 
                link: "/stadium",
                color: "from-indigo-500 to-indigo-600" 
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <a 
                  href={item.link} 
                  className="block group h-full"
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 h-full flex flex-col overflow-hidden relative">
                    <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${item.color}`}></div>
                    <div className="mb-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} text-white`}>
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm flex-1">{item.description}</p>
                    <div className="mt-4 flex items-center text-sm font-medium text-team-blue group-hover:translate-x-1 transition-transform">
                      View Details <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Latest News */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest News</h2>
              <p className="text-gray-600 max-w-2xl">Stay updated with the latest happenings from Banks o' Dee FC.</p>
            </div>
            <a 
              href="/news" 
              className="mt-4 md:mt-0 inline-flex items-center bg-team-blue hover:bg-team-blue/90 text-white px-4 py-2 rounded-md transition-colors"
            >
              View All News <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockNews.map((news) => (
              <NewsCard
                key={news.id}
                title={news.title}
                excerpt={news.excerpt}
                image={news.image}
                date={news.date}
                category={news.category}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Team Members */}
      <TeamGrid />
      
      {/* Stadium Section */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png" 
            alt="Spain Park Stadium" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-team-blue/90 to-team-blue/70"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2 mb-10 md:mb-0"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Spain Park Stadium
              </h2>
              <p className="text-white/80 text-lg mb-6 max-w-lg">
                Our home ground since 1924, Spain Park has seen generations of 
                fans witness memorable moments in Banks o' Dee FC history.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <a 
                  href="/stadium" 
                  className="inline-flex items-center justify-center bg-white text-team-blue px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
                >
                  Stadium Information
                </a>
                <a 
                  href="/tickets" 
                  className="inline-flex items-center justify-center bg-transparent text-white border border-white/30 px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
                >
                  Match Tickets
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2 flex justify-center"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-md p-4 text-center">
                    <p className="text-3xl font-bold text-white mb-1">2,500</p>
                    <p className="text-white/70 text-sm">Capacity</p>
                  </div>
                  <div className="bg-white/10 rounded-md p-4 text-center">
                    <p className="text-3xl font-bold text-white mb-1">1924</p>
                    <p className="text-white/70 text-sm">Established</p>
                  </div>
                  <div className="bg-white/10 rounded-md p-4 text-center">
                    <p className="text-3xl font-bold text-white mb-1">43</p>
                    <p className="text-white/70 text-sm">Home Wins</p>
                  </div>
                  <div className="bg-white/10 rounded-md p-4 text-center">
                    <p className="text-3xl font-bold text-white mb-1">12</p>
                    <p className="text-white/70 text-sm">Trophies Won</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
