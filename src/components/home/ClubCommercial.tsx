
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingBagIcon } from 'lucide-react';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  salePrice?: number;
  link: string;
}

interface MembershipTier {
  id: string;
  name: string;
  price: number;
  period: string;
  benefits: string[];
  isPopular?: boolean;
  link: string;
}

const ClubCommercial: React.FC = () => {
  // References for scrolling shop items
  const shopItemsRef = useRef<HTMLDivElement>(null);
  
  // Check if elements are in view
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  // Scroll shop items
  const scrollShopItems = (direction: 'left' | 'right') => {
    if (shopItemsRef.current) {
      const scrollAmount = 340; // Width of one item + gap
      const currentScroll = shopItemsRef.current.scrollLeft;
      
      shopItemsRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Mock shop items data
  const shopItems: ShopItem[] = [
    {
      id: 'item-1',
      name: 'Home Kit 2025/26',
      price: 49.99,
      imageUrl: '/lovable-uploads/b937e144-e94f-4e75-881f-1e560c6b520a.png',
      category: 'Kits',
      isNew: true,
      link: '/shop/item-1'
    },
    {
      id: 'item-2',
      name: 'Away Kit 2025/26',
      price: 49.99,
      imageUrl: '/lovable-uploads/e2efc1b0-1c8a-4e98-9826-3030a5f5d247.png',
      category: 'Kits',
      isNew: true,
      link: '/shop/item-2'
    },
    {
      id: 'item-3',
      name: 'Training Jacket',
      price: 59.99,
      imageUrl: '/lovable-uploads/ba4e2b09-12ed-48ad-a4ba-1162ab87ad70.png',
      category: 'Training',
      link: '/shop/item-3'
    },
    {
      id: 'item-4',
      name: 'Retro Scarf',
      price: 19.99,
      imageUrl: '/lovable-uploads/cb95b9fb-0f2d-42ef-9788-10509a80ed6e.png',
      category: 'Accessories',
      isSale: true,
      salePrice: 14.99,
      link: '/shop/item-4'
    },
    {
      id: 'item-5',
      name: 'Football',
      price: 24.99,
      imageUrl: '/lovable-uploads/7f997ef4-9019-4660-9e9e-4e230d7b1eb3.png',
      category: 'Equipment',
      link: '/shop/item-5'
    }
  ];
  
  // Mock membership tiers data
  const membershipTiers: MembershipTier[] = [
    {
      id: 'tier-1',
      name: 'Silver Membership',
      price: 80,
      period: 'per season',
      benefits: [
        'Season Ticket for all Home League Games',
        'Free Match Day Programme',
        '10% Discount in Club Shop'
      ],
      link: '/memberships/silver'
    },
    {
      id: 'tier-2',
      name: 'Gold Membership',
      price: 120,
      period: 'per season',
      benefits: [
        'Season Ticket for all Home Games',
        'Free Match Day Programme',
        '15% Discount in Club Shop',
        'Reserved Seating',
        'Christmas Event Invitation'
      ],
      isPopular: true,
      link: '/memberships/gold'
    },
    {
      id: 'tier-3',
      name: 'Platinum Membership',
      price: 180,
      period: 'per season',
      benefits: [
        'Season Ticket for all Home Games',
        'Free Match Day Programme',
        '20% Discount in Club Shop',
        'Premium Reserved Seating',
        'Christmas Event Invitation',
        'Player Meet & Greet'
      ],
      link: '/memberships/platinum'
    }
  ];
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Shop Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-team-blue">Club Shop</h2>
              <p className="text-gray-600">Latest Merchandise & Official Kit</p>
            </motion.div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => scrollShopItems('left')}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                aria-label="Scroll left"
              >
                <ChevronLeftIcon className="h-5 w-5 text-team-blue" />
              </button>
              <button
                onClick={() => scrollShopItems('right')}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                aria-label="Scroll right"
              >
                <ChevronRightIcon className="h-5 w-5 text-team-blue" />
              </button>
            </div>
          </div>
          
          <div 
            ref={shopItemsRef}
            className="flex overflow-x-auto py-4 -mx-4 px-4 space-x-6 hide-scrollbar"
            style={{ scrollbarWidth: 'none' }}
          >
            {shopItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="flex-shrink-0 w-[300px]"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-card border border-gray-100 h-full">
                  <div className="relative">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    
                    {(item.isNew || item.isSale) && (
                      <div className="absolute top-2 left-2">
                        <span className={cn(
                          "inline-block px-2 py-1 text-xs font-bold rounded",
                          item.isNew ? "bg-team-blue text-white" : "bg-accent-500 text-team-blue"
                        )}>
                          {item.isNew ? 'NEW' : 'SALE'}
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2">
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-team-blue truncate">{item.name}</h3>
                    
                    <div className="flex items-center mt-2 mb-4">
                      {item.isSale && item.salePrice ? (
                        <>
                          <span className="font-bold text-lg">£{item.salePrice.toFixed(2)}</span>
                          <span className="ml-2 text-gray-500 line-through text-sm">£{item.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-lg">£{item.price.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <a 
                      href={item.link}
                      className="block w-full bg-team-blue text-white text-center font-medium py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
                    >
                      <ShoppingBagIcon className="inline-block h-4 w-4 mr-2" />
                      Add to Cart
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="/shop"
              className="inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 text-team-blue font-medium rounded transition-colors"
            >
              Visit Online Shop
              <ChevronRightIcon className="inline-block h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
        
        {/* Membership Section */}
        <div>
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-team-blue">Season Tickets & Memberships</h2>
            <p className="text-gray-600 mt-2">Support your local club and enjoy exclusive benefits</p>
          </motion.div>
          
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {membershipTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                variants={fadeIn}
                className={cn(
                  "relative rounded-lg overflow-hidden border",
                  tier.isPopular ? "shadow-xl border-accent-500" : "shadow-card border-gray-200"
                )}
              >
                {tier.isPopular && (
                  <div className="absolute top-0 left-0 right-0 bg-accent-500 text-team-blue py-1 text-center text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                
                <div className={cn(
                  "p-6",
                  tier.isPopular ? "pt-8" : ""
                )}>
                  <h3 className="text-xl font-bold text-team-blue mb-2">{tier.name}</h3>
                  
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-bold">£{tier.price}</span>
                    <span className="text-gray-500 ml-1">{tier.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-accent-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href={tier.link}
                    className={cn(
                      "block w-full text-center font-medium py-2.5 px-4 rounded transition-colors",
                      tier.isPopular 
                        ? "bg-accent-500 text-team-blue hover:bg-accent-600" 
                        : "bg-team-blue text-white hover:bg-opacity-90"
                    )}
                  >
                    Get {tier.name}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div
            className="mt-12 bg-gray-50 rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-xl font-bold text-team-blue mb-4">Group & Corporate Packages</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Looking for group tickets or corporate hospitality? We offer special packages for groups of 10 or more,
              and bespoke hospitality experiences for businesses.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/group-tickets"
                className="bg-white border border-gray-200 hover:border-team-blue text-team-blue font-medium px-6 py-3 rounded transition-all"
              >
                Group Tickets
              </a>
              <a 
                href="/corporate"
                className="bg-white border border-gray-200 hover:border-team-blue text-team-blue font-medium px-6 py-3 rounded transition-all"
              >
                Corporate Hospitality
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ClubCommercial;
