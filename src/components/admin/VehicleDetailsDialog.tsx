
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Vehicle, ParkingSpot } from '@/types';
import StatusBadge from '../StatusBadge';
import { toast } from 'sonner';
import { mockParkingSpots } from '@/data/mockData';

interface VehicleDetailsDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (vehicle: Vehicle, newStatus: Vehicle['status']) => void;
}

const VehicleDetailsDialog: React.FC<VehicleDetailsDialogProps> = ({
  vehicle,
  open,
  onOpenChange,
  onStatusChange,
}) => {
  const [processing, setProcessing] = useState(false);

  if (!vehicle) return null;

  const formatTime = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString();
  };

  const handleStatusChange = (newStatus: Vehicle['status']) => {
    if (!vehicle || !onStatusChange) return;
    
    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      onStatusChange(vehicle, newStatus);
      setProcessing(false);
      onOpenChange(false);
      toast.success(`Vehicle ${newStatus === 'retrieved' ? 'retrieved' : 'marked for retrieval'} successfully`);
    }, 1000);
  };

  const getParkingSpotDetails = (spotId: string | undefined): ParkingSpot | undefined => {
    if (!spotId) return undefined;
    return mockParkingSpots.find(spot => spot.id === spotId);
  };

  const spotDetails = getParkingSpotDetails(vehicle.parkingSpot);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Vehicle Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">License Plate</h3>
              <p className="text-lg font-medium">{vehicle.licensePlate}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Status</h3>
              <StatusBadge status={vehicle.status} className="mt-1" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Make & Model</h3>
              <p>{vehicle.make} {vehicle.model}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Color</h3>
              <p>{vehicle.color}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Owner</h3>
              <p>{vehicle.ownerName}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Phone</h3>
              <p>{vehicle.ownerPhone}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Check-In Time</h3>
              <p>{formatTime(vehicle.checkInTime)}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Parking Location</h3>
              <p>{vehicle.parkingSpot || 'Not assigned'}</p>
            </div>
          </div>
          
          {spotDetails && (
            <div className="mt-4 p-3 bg-slate-50 rounded-md">
              <h3 className="text-sm font-semibold">Parking Spot Details</h3>
              <p className="text-sm">{spotDetails.location}</p>
            </div>
          )}
          
          {vehicle.notes && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-500">Notes</h3>
              <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{vehicle.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          {vehicle.status === 'checked-in' && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange('pending-retrieval')}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Mark for Retrieval'}
            </Button>
          )}
          {vehicle.status === 'pending-retrieval' && (
            <Button 
              onClick={() => handleStatusChange('retrieved')}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Mark as Retrieved'}
            </Button>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailsDialog;
