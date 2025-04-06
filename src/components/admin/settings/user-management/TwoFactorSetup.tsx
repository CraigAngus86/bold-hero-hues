import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  QrCode, 
  Shield, 
  Smartphone, 
  Mail,
  BadgeCheck,
  InfoIcon
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TwoFactorSetup = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5 text-primary" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Configure two-factor authentication methods for users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Coming Soon</AlertTitle>
          <AlertDescription>
            Two-factor authentication configuration will be available in a future update.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <h4 className="text-sm font-semibold">Available Authentication Methods</h4>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <QrCode className="mr-2 h-4 w-4" />
                    Authenticator App
                  </div>
                </TableCell>
                <TableCell>Time-based one-time passwords (TOTP)</TableCell>
                <TableCell>
                  <span className="text-amber-500 text-sm font-medium">Coming soon</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Verification
                  </div>
                </TableCell>
                <TableCell>Send verification codes via email</TableCell>
                <TableCell>
                  <span className="text-amber-500 text-sm font-medium">Coming soon</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Smartphone className="mr-2 h-4 w-4" />
                    SMS Verification
                  </div>
                </TableCell>
                <TableCell>Send verification codes via SMS</TableCell>
                <TableCell>
                  <span className="text-amber-500 text-sm font-medium">Coming soon</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Recovery Codes
                  </div>
                </TableCell>
                <TableCell>One-time backup codes for account access</TableCell>
                <TableCell>
                  <span className="text-amber-500 text-sm font-medium">Coming soon</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end">
          <Button disabled>Configure 2FA</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;
