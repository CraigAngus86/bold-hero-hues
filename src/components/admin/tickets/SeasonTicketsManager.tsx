
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarRange, Users, Ticket, BadgePlus, BadgePercent } from 'lucide-react';

const SeasonTicketsManager: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-1">Season Tickets</h2>
          <p className="text-gray-600">Manage season ticket options and sales.</p>
        </div>
        <Button>Set Up New Season</Button>
      </div>

      {/* Current Season Info */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800">2023/2024 Season</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <CalendarRange className="mt-0.5 text-blue-700" size={18} />
              <div>
                <p className="font-medium text-gray-900">Season Period</p>
                <p>August 2023 - May 2024</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Ticket className="mt-0.5 text-blue-700" size={18} />
              <div>
                <p className="font-medium text-gray-900">Home Matches</p>
                <p>18 included</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Users className="mt-0.5 text-blue-700" size={18} />
              <div>
                <p className="font-medium text-gray-900">Season Tickets Sold</p>
                <p>267</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <BadgePercent className="mt-0.5 text-blue-700" size={18} />
              <div>
                <p className="font-medium text-gray-900">Status</p>
                <p>Early Bird Pricing Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Season Ticket Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <BadgePlus size={16} className="mr-2" />
              Season Ticket Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">Adult Season Ticket</p>
                  <p className="text-sm text-gray-600">£180 (Save £30)</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">Concession Season Ticket</p>
                  <p className="text-sm text-gray-600">£120 (Save £30)</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">Junior Season Ticket</p>
                  <p className="text-sm text-gray-600">£60 (Save £30)</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">Family Season Ticket</p>
                  <p className="text-sm text-gray-600">£360 (Save £90)</p>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Season Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Member Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Entry to all home league matches</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>10% discount at the club shop</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Priority access to cup matches</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Exclusive season ticket holder events</span>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-1 mr-3 mt-0.5">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Digital matchday program</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4">Edit Benefits</Button>
          </CardContent>
        </Card>
      </div>

      <div className="border-t mt-8 pt-6 text-center text-sm text-gray-500">
        <p>This is a sample season tickets manager interface. In a future update, this will be connected to Supabase.</p>
      </div>
    </div>
  );
};

export default SeasonTicketsManager;
