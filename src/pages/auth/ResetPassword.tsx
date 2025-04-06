
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Define form schema with password confirmation
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState(true);
  
  // Set up form with zod validation
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });
  
  // Check if the URL has valid reset parameters
  useEffect(() => {
    const checkResetLink = async () => {
      try {
        // Ensure we're on a password reset page with proper hash parameters
        const hash = window.location.hash;
        if (!hash || !hash.includes('type=recovery')) {
          setIsValidLink(false);
          setError("Invalid or expired password reset link");
          return;
        }
        
        // Additional validation could be done here
        setIsValidLink(true);
      } catch (err) {
        console.error("Error checking reset link:", err);
        setIsValidLink(false);
        setError("Error validating your reset link");
      }
    };
    
    checkResetLink();
  }, []);
  
  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update password with Supabase
      const { error } = await supabase.auth.updateUser({ 
        password: data.password 
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Your password has been reset successfully");
      
      // Redirect to login
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Failed to reset password. Please try again or request a new reset link.");
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <img 
            src="/lovable-uploads/banks-o-dee-logo.png" 
            alt="Banks O' Dee FC" 
            className="h-20" 
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-team-blue">Reset Your Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!isValidLink ? (
              <div className="text-center py-4">
                <p className="text-destructive">Invalid or expired password reset link.</p>
                <Button 
                  onClick={() => navigate('/auth/forgot-password')} 
                  className="mt-4"
                >
                  Request New Reset Link
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password"
                            autoComplete="new-password"
                            disabled={isLoading} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="••••••••" 
                            type="password"
                            autoComplete="new-password"
                            disabled={isLoading} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-team-blue hover:bg-team-navy" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              variant="link" 
              onClick={() => navigate('/auth/login')}
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
