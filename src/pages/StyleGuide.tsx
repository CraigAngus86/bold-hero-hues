
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BaseText from '@/components/ui/BaseText';
import Container from '@/components/ui/Container';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui';
import { Award, Calendar, Check, Clock, Home, Mail, MessageSquare, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const { H1, H2, H3, H4, Body, Small } = Typography;

const StyleGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 pb-28">
      <Container>
        <div className="space-y-12">
          {/* Introduction */}
          <div>
            <H1 className="mb-4">Banks o' Dee FC Design System</H1>
            <Body className="max-w-3xl">
              This style guide documents the design system used across the Banks o' Dee FC website to ensure visual consistency and a professional appearance.
            </Body>
          </div>
          
          {/* Color Palette */}
          <div>
            <H2 className="mb-6">Color Palette</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Primary Colors</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-3">
                    {[900, 800, 700, 600, 500, 400, 300, 200, 100, 50].map((shade) => (
                      <div key={`primary-${shade}`} className="flex items-center">
                        <div className={`w-12 h-12 rounded bg-primary-${shade} mr-4 shadow-sm`}></div>
                        <div>
                          <BaseText variant="subtitle" className="mb-0">Primary {shade}</BaseText>
                          <div className="flex gap-x-3">
                            <BaseText variant="small" className="font-mono">bg-primary-{shade}</BaseText>
                            <span className="text-xs text-gray-500">|</span>
                            <BaseText variant="small" className="font-mono">
                              {shade === 800 ? '#00105A' : 
                               shade === 300 ? '#7276AF' : 
                               shade === 500 ? '#232984' : ''}
                            </BaseText>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Secondary Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Secondary Colors</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-3">
                    {[900, 800, 700, 600, 500, 400, 300, 200, 100, 50].map((shade) => (
                      <div key={`secondary-${shade}`} className="flex items-center">
                        <div className={`w-12 h-12 rounded bg-secondary-${shade} mr-4 shadow-sm`}></div>
                        <div>
                          <BaseText variant="subtitle" className="mb-0">Secondary {shade}</BaseText>
                          <div className="flex gap-x-3">
                            <BaseText variant="small" className="font-mono">bg-secondary-{shade}</BaseText>
                            <span className="text-xs text-gray-500">|</span>
                            <BaseText variant="small" className="font-mono">
                              {shade === 300 ? '#C5E7FF' : 
                               shade === 800 ? '#0076EC' : 
                               shade === 500 ? '#75BEFF' : ''}
                            </BaseText>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Accent Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Accent Colors</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-3">
                    {[700, 600, 500, 400, 300].map((shade) => (
                      <div key={`accent-${shade}`} className="flex items-center">
                        <div className={`w-12 h-12 rounded bg-accent-${shade} mr-4 shadow-sm`}></div>
                        <div>
                          <BaseText variant="subtitle" className="mb-0">Accent {shade}</BaseText>
                          <div className="flex gap-x-3">
                            <BaseText variant="small" className="font-mono">bg-accent-{shade}</BaseText>
                            <span className="text-xs text-gray-500">|</span>
                            <BaseText variant="small" className="font-mono">
                              {shade === 500 ? '#FFD700' : 
                               shade === 400 ? '#FFD81A' : 
                               shade === 600 ? '#E6C200' : ''}
                            </BaseText>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Gray colors */}
                    <Separator className="my-4" />
                    <H4>Gray Scale</H4>
                    
                    {[900, 800, 700, 600, 500, 400, 300, 200, 100, 50].map((shade) => (
                      <div key={`gray-${shade}`} className="flex items-center">
                        <div className={`w-12 h-12 rounded bg-gray-${shade} mr-4 shadow-sm`}></div>
                        <div>
                          <BaseText variant="subtitle" className="mb-0">Gray {shade}</BaseText>
                          <BaseText variant="small" className="font-mono">bg-gray-{shade}</BaseText>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Typography */}
          <div>
            <H2 className="mb-6">Typography</H2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Headings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <H1>Heading 1 (H1)</H1>
                    <BaseText variant="small" className="text-gray-500 font-mono">text-3xl/4xl font-bold text-primary-800</BaseText>
                  </div>
                  
                  <div>
                    <H2>Heading 2 (H2)</H2>
                    <BaseText variant="small" className="text-gray-500 font-mono">text-2xl/3xl font-bold text-primary-800</BaseText>
                  </div>
                  
                  <div>
                    <H3>Heading 3 (H3)</H3>
                    <BaseText variant="small" className="text-gray-500 font-mono">text-xl/2xl font-semibold text-primary-800</BaseText>
                  </div>
                  
                  <div>
                    <H4>Heading 4 (H4)</H4>
                    <BaseText variant="small" className="text-gray-500 font-mono">text-lg/xl font-semibold text-primary-800</BaseText>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Body Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Typography.Subtitle>Subtitle</Typography.Subtitle>
                    <BaseText variant="small" className="text-gray-500 font-mono">text-lg font-medium text-primary-600</BaseText>
                  </div>
                  
                  <div>
                    <Body>Body Text - This is a paragraph of text that shows the default body styling used across the Banks o' Dee FC website. It should be easy to read with proper line height and spacing.</Body>
                    <BaseText variant="small" className="text-gray-500 font-mono mt-2">text-base text-gray-700</BaseText>
                  </div>
                  
                  <div>
                    <Small>Small Text - Used for captions, metadata, and other secondary information that doesn't need to stand out prominently.</Small>
                    <BaseText variant="small" className="text-gray-500 font-mono mt-2">text-sm text-gray-500</BaseText>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Buttons */}
          <div>
            <H2 className="mb-6">Buttons</H2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Button variant="default">
                      Primary Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500 font-mono">bg-primary-800 hover:bg-primary-700 text-white</BaseText>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="secondary">
                      Secondary Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500 font-mono">bg-secondary-300 text-primary-800 hover:bg-secondary-400</BaseText>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="accent">
                      Accent Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500 font-mono">bg-accent-500 text-primary-800 hover:bg-accent-600</BaseText>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline">
                      Outline Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500 font-mono">border border-primary-800 text-primary-800 hover:bg-primary-50</BaseText>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="link">
                      Link Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500 font-mono">text-primary-800 hover:underline</BaseText>
                  </div>
                  
                  <div className="space-y-2">
                    <Button disabled>
                      Disabled Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500 font-mono">opacity-70 cursor-not-allowed</BaseText>
                  </div>
                  
                  <div className="space-y-2">
                    <Button isLoading>
                      Loading Button
                    </Button>
                    <BaseText variant="small" className="text-gray-500 font-mono">With loading spinner</BaseText>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Button Sizes & States</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <H4>Button Sizes</H4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button size="lg">Large</Button>
                      <Button size="default">Default</Button>
                      <Button size="sm">Small</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <H4>With Icons</H4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button>
                        <Mail className="mr-2 h-4 w-4" /> Email
                      </Button>
                      <Button variant="secondary">
                        <Calendar className="mr-2 h-4 w-4" /> Schedule
                      </Button>
                      <Button variant="accent">
                        <Check className="mr-2 h-4 w-4" /> Confirm
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <H4>Icon Only</H4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <Button size="icon" aria-label="Home">
                        <Home className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" aria-label="User">
                        <User className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" aria-label="Message">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <H4>Full Width</H4>
                    <Button fullWidth={true}>Full Width Button</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Form Elements */}
          <div>
            <H2 className="mb-6">Form Elements</H2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Input Fields</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Text Input</label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Input</label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="disabled" className="block text-sm font-medium text-gray-700">Disabled Input</label>
                    <Input id="disabled" disabled placeholder="Disabled input" />
                  </div>
                  
                  <div className="space-y-3">
                    <label htmlFor="textarea" className="block text-sm font-medium text-gray-700">Text Area</label>
                    <Textarea id="textarea" placeholder="Enter your message" className="min-h-[100px]" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Selection Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <H4>Radio Example</H4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="radio-1"
                          name="radio-group"
                          type="radio"
                          defaultChecked
                          className="h-4 w-4 text-primary-800 border-gray-300 focus:ring-primary-500"
                        />
                        <label htmlFor="radio-1" className="ml-2 block text-sm text-gray-700">
                          Option One
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="radio-2"
                          name="radio-group"
                          type="radio"
                          className="h-4 w-4 text-primary-800 border-gray-300 focus:ring-primary-500"
                        />
                        <label htmlFor="radio-2" className="ml-2 block text-sm text-gray-700">
                          Option Two
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <H4>Checkbox Example</H4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="checkbox-1"
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-primary-800 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="checkbox-1" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="checkbox-2"
                          type="checkbox"
                          className="h-4 w-4 text-primary-800 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor="checkbox-2" className="ml-2 block text-sm text-gray-700">
                          Subscribe to newsletter
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Cards */}
          <div>
            <H2 className="mb-6">Cards</H2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    <CardTitle>Standard Card</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Body>
                    This is a standard card with a header. Cards provide a flexible and extensible content container with multiple variants.
                  </Body>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-primary-800">
                <CardHeader>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <CardTitle>Bordered Card</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Body>
                    This card has a primary colored top border to help it stand out. Use this for important information or highlighted content.
                  </Body>
                </CardContent>
              </Card>
              
              <Card className="border-t-4 border-accent-500">
                <CardHeader>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    <CardTitle>Accent Card</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Body>
                    This card uses our accent color for its top border. Great for notifications, important dates, or promotional content.
                  </Body>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Spacing */}
          <div>
            <H2 className="mb-6">Spacing System</H2>
            
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <H4 className="mb-4">Section Spacing</H4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-32 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small" className="font-mono">section (2rem)</BaseText>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-20 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small" className="font-mono">card (1rem)</BaseText>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-10 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small" className="font-mono">element (0.5rem)</BaseText>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <H4 className="mb-4">Component Spacing</H4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-16 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small" className="font-mono">p-4 (Card padding)</BaseText>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small" className="font-mono">gap-4 (Grid gap)</BaseText>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-800 opacity-30 mr-4"></div>
                        <BaseText variant="small" className="font-mono">mb-4 (Margin bottom)</BaseText>
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
