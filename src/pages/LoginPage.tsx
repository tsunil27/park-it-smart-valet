
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { CarFront } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (success) {
        // Login successful - redirect based on role
        const role = email.includes('admin') ? 'admin' : 
                     email.includes('attendant') ? 'attendant' : 'customer';
        
        // Fix for comparison error - redirect to admin dashboard for both admin and attendant roles
        navigate(role === 'admin' || role === 'attendant' ? '/admin' : '/customer');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto bg-valet-blue p-3 rounded-full text-white inline-flex mb-2">
            <CarFront size={28} />
          </div>
          <CardTitle className="text-2xl">Park-It Smart Valet</CardTitle>
          <CardDescription>
            Sign in to access the valet parking system
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-valet-blue hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="bg-blue-50 p-3 rounded text-sm">
              <p className="font-semibold text-valet-blue">Demo Accounts:</p>
              <p className="mt-1">Admin: admin@parkit.com</p>
              <p>Customer: john@example.com</p>
              <p>Password: password</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-valet-blue hover:bg-valet-blue/90"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
