
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BaseText from '@/components/ui/BaseText';
import Container from '@/components/ui/Container';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Award, Calendar, Check, Clock, Home, Mail, MessageSquare, User } from 'lucide-react';

const StyleGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <Container>
        <div className="space-y-12">
          {/* Introduction */}
          <div>
            <BaseText variant="h1" className="mb-4">Banks o' Dee FC Design System</BaseText>
            <BaseText variant="body" className="max-w-3xl">
              This style guide documents the design system used across the Banks o' Dee FC website to ensure visual consistency and a professional appearance.
            </BaseText>
          </div>
          
          {/* Color Palette */}
          <div>
            <BaseText variant="h2" className="mb-6">Color Palette</BaseText>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Colors */}
              <Card>
                <CardHeader className="bg-primary-800 text-white">
                  <BaseText variant="h3" className="text-white">Primary Colors</BaseText>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-primary-800 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Primary Blue</BaseText>
                        <BaseText variant="small" className="text-gray-500">#00105A</BaseText>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-primary-700 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Primary Blue - Dark</BaseText>
                        <BaseText variant="small" className="text-gray-500">#111866</BaseText>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-primary-600 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Primary Blue - Medium</BaseText>
                        <BaseText variant="small" className="text-gray-500">#1A2075</BaseText>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-primary-400 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Primary Blue - Light</BaseText>
                        <BaseText variant="small" className="text-gray-500">#4A509A</BaseText>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Secondary Colors */}
              <Card>
                <CardHeader className="bg-secondary-300 text-primary-800">
                  <BaseText variant="h3" className="text-primary-800">Secondary Colors</BaseText>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-secondary-300 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Secondary Blue</BaseText>
                        <BaseText variant="small" className="text-gray-500">#C5E7FF</BaseText>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-secondary-400 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Secondary Blue - Medium</BaseText>
                        <BaseText variant="small" className="text-gray-500">#A3D5FF</BaseText>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-secondary-200 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Secondary Blue - Light</BaseText>
                        <BaseText variant="small" className="text-gray-500">#DCEEFF</BaseText>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-secondary-800 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Secondary Blue - Dark</BaseText>
                        <BaseText variant="small" className="text-gray-500">#0076EC</BaseText>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Accent Colors */}
              <Card>
                <CardHeader className="bg-accent-500 text-primary-800">
                  <BaseText variant="h3" className="text-primary-800">Accent Colors</BaseText>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-accent-500 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Gold Accent</BaseText>
                        <BaseText variant="small" className="text-gray-500">#FFD700</BaseText>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-accent-400 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Gold Accent - Light</BaseText>
                        <BaseText variant="small" className="text-gray-500">#FFD81A</BaseText>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-accent-600 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Gold Accent - Dark</BaseText>
                        <BaseText variant="small" className="text-gray-500">#E6C200</BaseText>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded bg-gray-800 mr-4"></div>
                      <div>
                        <BaseText variant="subtitle" className="mb-0">Dark Gray</BaseText>
                        <BaseText variant="small" className="text-gray-500">#1F2937</BaseText>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Typography */}
          <div>
            <BaseText variant="h2" className="mb-6">Typography</BaseText>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <BaseText variant="h3">Headings</BaseText>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <BaseText variant="h1">Heading 1</BaseText>
                    <BaseText variant="small" className="text-gray-500">3xl/4xl font-bold text-primary-800</BaseText>
                  </div>
                  
                  <div>
                    <BaseText variant="h2">Heading 2</BaseText>
                    <BaseText variant="small" className="text-gray-500">2xl/3xl font-bold text-primary-800</BaseText>
                  </div>
                  
                  <div>
                    <BaseText variant="h3">Heading 3</BaseText>
                    <BaseText variant="small" className="text-gray-500">xl/2xl font-semibold text-primary-800</BaseText>
                  </div>
                  
                  <div>
                    <BaseText variant="h4">Heading 4</BaseText>
                    <BaseText variant="small" className="text-gray-500">lg/xl font-semibold text-primary-800</BaseText>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <BaseText variant="h3">Body Text</BaseText>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <BaseText variant="subtitle">Subtitle</BaseText>
                    <BaseText variant="small" className="text-gray-500">text-lg font-medium text-primary-600</BaseText>
                  </div>
                  
                  <div>
                    <BaseText variant="body">Body Text</BaseText>
                    <BaseText variant="small" className="text-gray-500">text-base text-gray-700</BaseText>
                  </div>
                  
                  <div>
                    <BaseText variant="small">Small Text</BaseText>
                    <BaseText variant="small" className="text-gray-500">text-sm text-gray-500</BaseText>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Buttons */}
          <div>
            <BaseText variant="h2" className="mb-6">Buttons</BaseText>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <BaseText variant="h3">Button Variants</BaseText>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Button size="lg" className="bg-primary-800 hover:bg-primary-700">
                      Primary Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500">bg-primary-800 hover:bg-primary-700 text-white</BaseText>
                  </div>
                  
                  <div className="space-y-2">
                    <Button size="lg" variant="outline" className="border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white">
                      Secondary Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500">border-primary-800 text-primary-800 hover:bg-primary-800</BaseText>
                  </div>
                  
                  <div className="space-y-2">
                    <Button size="lg" className="bg-secondary-300 text-primary-800 hover:bg-secondary-400 border-none">
                      Light Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500">bg-secondary-300 text-primary-800 hover:bg-secondary-400</BaseText>
                  </div>
                  
                  <div className="space-y-2">
                    <Button size="lg" className="bg-accent-500 text-primary-800 hover:bg-accent-600">
                      Accent Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500">bg-accent-500 text-primary-800 hover:bg-accent-600</BaseText>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <BaseText variant="h3">Button Sizes</BaseText>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button size="lg">Large</Button>
                    <Button>Default</Button>
                    <Button size="sm">Small</Button>
                  </div>
                  
                  <div className="space-y-3">
                    <BaseText variant="h4">With Icons</BaseText>
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button>
                        <Mail className="mr-2 h-4 w-4" /> Email
                      </Button>
                      <Button>
                        <Calendar className="mr-2 h-4 w-4" /> Schedule
                      </Button>
                      <Button>
                        <Check className="mr-2 h-4 w-4" /> Confirm
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <BaseText variant="h4">Icon Only</BaseText>
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button size="icon">
                        <Home className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline">
                        <User className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Form Elements */}
          <div>
            <BaseText variant="h2" className="mb-6">Form Elements</BaseText>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <BaseText variant="h3">Input Fields</BaseText>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Text Input</label>
                    <Input placeholder="Enter your name" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Input</label>
                    <Input type="email" placeholder="Enter your email" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password Input</label>
                    <Input type="password" placeholder="Enter your password" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <BaseText variant="h3">Text Area</BaseText>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Enter your message" className="min-h-[120px]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Cards */}
          <div>
            <BaseText variant="h2" className="mb-6">Cards</BaseText>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-primary-800 text-white p-4">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    <BaseText variant="h4" className="text-white mb-0">Primary Card</BaseText>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <BaseText variant="body">
                    This is a primary card with a dark blue header. It's ideal for important information or featured content.
                  </BaseText>
                </CardContent>
              </Card>
              
              <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-secondary-300 text-primary-800 p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <BaseText variant="h4" className="text-primary-800 mb-0">Secondary Card</BaseText>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <BaseText variant="body">
                    This is a secondary card with a light blue header. It's good for secondary information or supporting content.
                  </BaseText>
                </CardContent>
              </Card>
              
              <Card className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-accent-500 text-primary-800 p-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <BaseText variant="h4" className="text-primary-800 mb-0">Accent Card</BaseText>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <BaseText variant="body">
                    This is an accent card with a gold header. It's perfect for highlighting special events or promotions.
                  </BaseText>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Spacing */}
          <div>
            <BaseText variant="h2" className="mb-6">Spacing System</BaseText>
            
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <BaseText variant="h4" className="mb-4">Section Spacing</BaseText>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-32 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small">py-8 md:py-12 (Section padding)</BaseText>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-20 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small">my-8 (Margin between sections)</BaseText>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <BaseText variant="h4" className="mb-4">Component Spacing</BaseText>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-16 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small">p-4 (Card padding)</BaseText>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small">gap-4 (Grid gap)</BaseText>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small">mb-4 (Margin bottom)</BaseText>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default StyleGuide;
