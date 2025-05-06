
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import VehicleForm from '@/components/check-in/VehicleForm';

const CheckInPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated or not staff
  React.useEffect(() => {
    if (!isAuthenticated || (role !== 'admin' && role !== 'attendant')) {
      navigate('/login');
    }
  }, [isAuthenticated, role, navigate]);
  
  const handleCheckInSuccess = () => {
    // Navigate to admin dashboard
    navigate('/admin');
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Vehicle Check-In</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Enter Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleForm onSuccess={handleCheckInSuccess} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckInPage;
