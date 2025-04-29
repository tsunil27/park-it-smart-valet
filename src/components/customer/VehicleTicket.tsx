
import React from 'react';
import { Vehicle } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';

interface VehicleTicketProps {
  vehicle: Vehicle;
}

const VehicleTicket: React.FC<VehicleTicketProps> = ({ vehicle }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const ticketData = JSON.stringify({
    id: vehicle.id,
    plate: vehicle.licensePlate,
    checkIn: vehicle.checkInTime
  });

  return (
    <Card className="animate-fade-in border-dashed">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold text-center mb-1">Parking Ticket</h2>
          <p className="text-gray-500 text-sm mb-4">Present this when picking up your vehicle</p>
          
          <div className="border-t border-b border-dashed py-4 w-full my-2">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Ticket #</span>
              <span className="font-mono">{vehicle.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Vehicle</span>
              <span>{vehicle.make} {vehicle.model}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">License</span>
              <span className="font-mono font-medium">{vehicle.licensePlate}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Date</span>
              <span>{formatDate(vehicle.checkInTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Check-in</span>
              <span>{formatTime(vehicle.checkInTime)}</span>
            </div>
          </div>
          
          <div className="my-4">
            <QRCodeSVG value={ticketData} size={150} />
          </div>
          
          <p className="text-xs text-center text-gray-400 mt-2">
            Park-It Smart Valet Service
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleTicket;
