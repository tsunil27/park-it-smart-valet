
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import VehicleStatus from '@/components/customer/VehicleStatus';
import VehicleTicket from '@/components/customer/VehicleTicket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vehicle, RetrievalRequest } from '@/types';
import { mockVehicles } from '@/data/mockData';
import { toast } from 'sonner';

const CustomerDashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [userVehicle, setUserVehicle] = useState<Vehicle | null>(null);
  const [retrievalRequested, setRetrievalRequested] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // In a real app, we would fetch the vehicle for the logged-in user
    // For demo purposes, we're using the first vehicle from mock data
    if (user) {
      const vehicle = mockVehicles.find(v => v.status !== 'retrieved');
      if (vehicle) {
        setUserVehicle(vehicle);
      }
    }
  }, [user]);

  // If not logged in, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no vehicle found for user
  if (!userVehicle) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Active Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have any vehicles currently parked with our valet service.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRequestRetrieval = () => {
    // Calculate estimated time (5 minutes from now)
    const eta = new Date();
    eta.setMinutes(eta.getMinutes() + 5);
    setEstimatedTime(eta);
    setRetrievalRequested(true);
    
    toast.success("Your vehicle retrieval request has been submitted", {
      description: "Your car will be ready shortly"
    });

    // In a real app, we would create a retrieval request and send it to the server
    const newRequest: RetrievalRequest = {
      id: `req-${Date.now()}`,
      vehicleId: userVehicle.id,
      requestTime: new Date(),
      estimatedTime: eta,
      status: 'pending'
    };

    // For demo purposes, we're not saving the request to any state
    console.log('Created retrieval request:', newRequest);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Welcome to Park-It Smart Valet</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vehicle Status Card */}
          <VehicleStatus 
            vehicle={userVehicle} 
            onRequestRetrieval={handleRequestRetrieval}
            retrievalRequested={retrievalRequested}
            estimatedTime={estimatedTime}
          />
          
          {/* Vehicle Ticket Card */}
          <VehicleTicket vehicle={userVehicle} />
        </div>
        
        {/* Help and Information */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Need Assistance?</h3>
            <p className="text-sm text-gray-500">
              If you need help with your vehicle or have questions about our valet service,
              please contact our valet desk at (555) 123-4567 or visit the valet stand in person.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
