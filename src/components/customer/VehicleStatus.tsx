
import React from 'react';
import { Vehicle } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CarFront, MapPin, Clock } from 'lucide-react';
import StatusBadge from '../StatusBadge';

interface VehicleStatusProps {
  vehicle: Vehicle;
  onRequestRetrieval: () => void;
  retrievalRequested: boolean;
  estimatedTime?: Date;
}

const VehicleStatus: React.FC<VehicleStatusProps> = ({ 
  vehicle, 
  onRequestRetrieval,
  retrievalRequested,
  estimatedTime
}) => {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const calculateParkingTime = (checkInTime: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(checkInTime).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  const isPendingRetrieval = vehicle.status === 'pending-retrieval';

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle>Your Vehicle Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6">
          <div className="mr-4">
            <div className="bg-valet-blue p-3 rounded-full text-white">
              <CarFront size={24} />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{vehicle.make} {vehicle.model}</h2>
            <p className="text-gray-500">{vehicle.color} • {vehicle.licensePlate}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={vehicle.status} />
          </div>
          
          <div className="flex items-start gap-3 py-2">
            <MapPin size={20} className="text-valet-blue mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Parking Location</p>
              <p className="text-gray-500">
                {vehicle.parkingSpot ? `Spot ${vehicle.parkingSpot}` : 'Not assigned'}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 py-2">
            <Clock size={20} className="text-valet-blue mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">Parking Time</p>
              <p className="text-gray-500">
                {calculateParkingTime(vehicle.checkInTime)} (since {formatTime(vehicle.checkInTime)})
              </p>
            </div>
          </div>
          
          {(retrievalRequested || isPendingRetrieval) && estimatedTime && (
            <div className="bg-valet-blue/10 p-4 rounded-lg mt-4 animate-fade-in">
              <h3 className="font-medium text-valet-blue mb-1">Retrieval Requested</h3>
              <p className="text-sm">
                Your vehicle will be ready at approximately <strong>{formatTime(estimatedTime)}</strong>
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-3">
                <div className="bg-valet-blue h-2 rounded-full w-1/3 animate-pulse"></div>
              </div>
              <p className="text-xs text-center mt-2">Processing your request</p>
            </div>
          )}

          {!retrievalRequested && !isPendingRetrieval && vehicle.status === 'checked-in' && (
            <Button 
              onClick={onRequestRetrieval} 
              className="w-full mt-4 bg-valet-blue hover:bg-valet-blue/90"
            >
              Get My Car
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleStatus;
