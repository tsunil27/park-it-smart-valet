
import React from 'react';
import { Vehicle } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
  showRetrieveButton?: boolean;
}

const VehicleList: React.FC<VehicleListProps> = ({ 
  vehicles, 
  onVehicleSelect,
  showRetrieveButton = false
}) => {
  // Sort vehicles by check-in time (newest first)
  const sortedVehicles = [...vehicles].sort((a, b) => 
    new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
  );

  const formatDuration = (date: Date) => {
    try {
      return formatDistanceToNow(date, { addSuffix: false });
    } catch (e) {
      return 'Unknown';
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No active vehicles found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">VEHICLE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                TIME
              </div>
            </TableHead>
            <TableHead className="text-right">ACTION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedVehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell>
                <div className="font-medium">{vehicle.licensePlate}</div>
                <div className="text-sm text-muted-foreground">
                  {vehicle.make} {vehicle.model}
                </div>
                <div className="text-sm text-muted-foreground">
                  {vehicle.ownerName}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <StatusBadge status={vehicle.status === 'pending-retrieval' ? 'retrieving' : 'parked'} />
                  <div className="text-xs text-gray-500 mt-1">
                    Spot: {vehicle.parkingSpot || 'Unknown'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {formatDuration(vehicle.checkInTime)}
              </TableCell>
              <TableCell className="text-right">
                {showRetrieveButton && vehicle.status !== 'pending-retrieval' ? (
                  <Button
                    size="sm"
                    onClick={() => onVehicleSelect(vehicle)}
                    className="bg-valet-blue hover:bg-valet-blue/90"
                  >
                    Retrieve
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant={vehicle.status === 'pending-retrieval' ? "success" : "secondary"}
                    onClick={() => onVehicleSelect(vehicle)}
                    className={vehicle.status === 'pending-retrieval' ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                  >
                    {vehicle.status === 'pending-retrieval' ? 'Complete' : 'Details'}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleList;
