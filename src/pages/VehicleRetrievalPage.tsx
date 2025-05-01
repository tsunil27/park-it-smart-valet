
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CarFront, Phone, Search } from 'lucide-react';
import { mockVehicles } from '@/data/mockData';
import { toast } from 'sonner';
import { Vehicle, RetrievalRequest } from '@/types';

const VehicleRetrievalPage: React.FC = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retrievalStatus, setRetrievalStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRetrievalStatus('idle');
    
    try {
      // Simulate API call to check vehicle details
      const foundVehicleIndex = mockVehicles.findIndex(
        v => v.licensePlate.toLowerCase() === licensePlate.toLowerCase() && 
             v.ownerPhone === phoneNumber &&
             v.status === 'checked-in'
      );
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (foundVehicleIndex !== -1) {
        const foundVehicle = mockVehicles[foundVehicleIndex];
        
        // Calculate estimated time (5 minutes from now)
        const eta = new Date();
        eta.setMinutes(eta.getMinutes() + 5);
        setEstimatedTime(eta);
        
        // Update vehicle status to pending-retrieval
        mockVehicles[foundVehicleIndex] = {
          ...foundVehicle,
          status: 'pending-retrieval'
        };
        
        // Update the vehicle state with the updated status
        setVehicle({
          ...foundVehicle,
          status: 'pending-retrieval'
        });
        
        setRetrievalStatus('success');
        
        // Create retrieval request
        const newRequest: RetrievalRequest = {
          id: `req-${Date.now()}`,
          vehicleId: foundVehicle.id,
          requestTime: new Date(),
          estimatedTime: eta,
          status: 'pending'
        };
        
        // In a real app, we would send this to the backend
        console.log('Created retrieval request:', newRequest);
        console.log('Updated vehicle status to pending-retrieval:', mockVehicles[foundVehicleIndex]);
        
        toast.success("Your vehicle retrieval request has been submitted", {
          description: "Your car will be ready shortly"
        });
      } else {
        setRetrievalStatus('error');
        toast.error("Vehicle not found", {
          description: "Please check your license plate and phone number"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto bg-valet-blue p-3 rounded-full text-white inline-flex mb-2">
            <CarFront size={28} />
          </div>
          <CardTitle className="text-2xl">Park-It Smart Valet</CardTitle>
          <CardDescription>
            Request your vehicle retrieval
          </CardDescription>
        </CardHeader>
        
        {retrievalStatus !== 'success' ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <div className="flex items-center relative">
                  <CarFront className="absolute left-3 text-gray-400" size={18} />
                  <Input
                    id="licensePlate"
                    placeholder="Enter your license plate"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="flex items-center relative">
                  <Phone className="absolute left-3 text-gray-400" size={18} />
                  <Input
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              {retrievalStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm">
                  <p>We couldn't find a vehicle matching these details. Please check your information or contact the valet desk for assistance.</p>
                </div>
              )}
              
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-valet-blue hover:bg-valet-blue/90 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Search size={18} />
                    Request My Vehicle
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg animate-fade-in">
              <h3 className="font-medium text-green-700 flex items-center gap-2 mb-2">
                Vehicle Retrieval Requested
              </h3>
              <p className="text-sm text-gray-700">
                We're preparing your {vehicle?.color} {vehicle?.make} {vehicle?.model} with 
                license plate <strong>{vehicle?.licensePlate}</strong>.
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Your vehicle will be ready at approximately <strong>{estimatedTime && formatTime(estimatedTime)}</strong>
              </p>
              
              <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
                <div className="bg-valet-blue h-2 rounded-full w-1/3 animate-pulse"></div>
              </div>
              <p className="text-xs text-center mt-2 text-gray-500">Processing your request</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-valet-blue mb-1">Need assistance?</h3>
              <p className="text-sm">
                If you need help with your vehicle or have questions about our valet service,
                please contact our valet desk at (555) 123-4567.
              </p>
            </div>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => {
                setRetrievalStatus('idle');
                setVehicle(null);
                setLicensePlate('');
                setPhoneNumber('');
              }}
            >
              Request Another Vehicle
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default VehicleRetrievalPage;
