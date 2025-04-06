
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const UserRolePermissions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>Define role permissions and access levels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Role permissions layout */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Admin Role Permissions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['News Management', 'Team Management', 'Fixtures', 'League Table', 
                'Media Gallery', 'Sponsors', 'Tickets', 'Fans', 'Settings'].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox id={`admin-${area.toLowerCase().replace(' ', '-')}`} defaultChecked />
                  <label htmlFor={`admin-${area.toLowerCase().replace(' ', '-')}`}>
                    {area}
                  </label>
                </div>
              ))}
            </div>
            
            <h4 className="text-sm font-semibold mt-4">Editor Role Permissions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['News Management', 'Team Management', 'Fixtures', 'League Table', 
                'Media Gallery', 'Sponsors', 'Tickets', 'Fans', 'Settings'].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`editor-${area.toLowerCase().replace(' ', '-')}`} 
                    defaultChecked={['News Management', 'Team Management', 'Media Gallery'].includes(area)}
                  />
                  <label htmlFor={`editor-${area.toLowerCase().replace(' ', '-')}`}>
                    {area}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRolePermissions;
