
import { useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import NewsSection from '@/components/home/NewsSection';
import FixturesSection from '@/components/FixturesSection';
import SocialFanSection from '@/components/home/SocialFanSection';
import MediaGalleryModern from '@/components/home/MediaGalleryModern';
import SponsorsSection from '@/components/home/SponsorsSection';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useFeaturedArticles } from '@/hooks/useFeaturedArticles';
import { Container } from '@/components/ui';

const Index = () => {
  // Get featured articles IDs to exclude from news section
  const { articleIds: featuredArticleIds } = useFeaturedArticles(4);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <ErrorBoundary>
        <HeroSection />
      </ErrorBoundary>
      
      {/* Section Divider with Texture */}
      <div className="w-full h-12 bg-gradient-to-r from-primary-800 via-primary-700 to-primary-600 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "40px 40px"
          }}
        ></div>
      </div>
      
      {/* Latest News - updated to show 9 articles in a 12x12 grid */}
      <ErrorBoundary>
        <div className="py-12 md:py-16 bg-white">
          <Container>
            <NewsSection excludeIds={featuredArticleIds} initialCount={9} />
          </Container>
        </div>
      </ErrorBoundary>
      
      {/* Diagonal Section Divider with Texture */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-white z-10"></div>
        <div className="absolute -bottom-10 left-0 right-0 h-24 bg-primary-800 transform -skew-y-2 z-20"></div>
        <div 
          className="absolute -bottom-10 left-0 right-0 h-24 transform -skew-y-2 z-30 opacity-20"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10z'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "20px 20px"
          }}
        ></div>
      </div>
      
      {/* Fixtures, Results & League Table Section */}
      <ErrorBoundary>
        <div className="bg-primary-800 text-white py-12 md:py-16">
          <Container>
            <FixturesSection />
          </Container>
        </div>
      </ErrorBoundary>
      
      {/* Diagonal Section Divider with Texture */}
      <div className="relative h-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary-800 z-10"></div>
        <div className="absolute -bottom-10 left-0 right-0 h-24 bg-gray-50 transform skew-y-2 z-20"></div>
        <div 
          className="absolute -bottom-10 left-0 right-0 h-24 transform skew-y-2 z-30 opacity-20"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300105a' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "40px 40px"
          }}
        ></div>
      </div>
      
      {/* Combined Social Media and Fan Zone Section */}
      <ErrorBoundary>
        <div className="py-12 md:py-16 bg-gray-50">
          <Container>
            <SocialFanSection />
          </Container>
        </div>
      </ErrorBoundary>
      
      {/* Curved Section Divider with Texture */}
      <div className="relative h-24">
        <svg className="absolute bottom-0 w-full h-24 z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#00105a" fillOpacity="1" d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,213.3C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
        <div 
          className="absolute bottom-0 w-full h-24 z-20 opacity-20"
          style={{
            maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23000000' fill-opacity='1' d='M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,213.3C1120,224,1280,224,1360,224L1440,224L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z'%3E%3C/path%3E%3C/svg%3E\")",
            maskSize: "100% 100%",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 0h10v10H0V0zm10 10h10v10H10V10z'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "20px 20px"
          }}
        ></div>
      </div>
      
      {/* Media Gallery - Modern Mosaic Implementation */}
      <ErrorBoundary>
        <div className="bg-primary-800 text-white py-12 md:py-16">
          <Container>
            <MediaGalleryModern />
          </Container>
        </div>
      </ErrorBoundary>
      
      {/* Wave Section Divider with Texture */}
      <div className="relative h-24">
        <svg className="absolute top-0 w-full h-24 z-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#00105a" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,160C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
        <div 
          className="absolute top-0 w-full h-24 z-20 opacity-20"
          style={{
            maskImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23000000' fill-opacity='1' d='M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,160C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'%3E%3C/path%3E%3C/svg%3E\")",
            maskSize: "100% 100%",
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300105a' fill-opacity='0.4'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "40px 40px"
          }}
        ></div>
      </div>
      
      {/* Sponsors Section */}
      <ErrorBoundary>
        <div className="py-12 md:py-16 bg-white">
          <Container>
            <SponsorsSection />
          </Container>
        </div>
      </ErrorBoundary>
      
      <Footer />
    </div>
  );
};

export default Index;
