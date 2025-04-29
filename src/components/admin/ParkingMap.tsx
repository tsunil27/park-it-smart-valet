
import React, { useState } from 'react';
import { ParkingSpot, Vehicle } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getVehicleById } from '@/data/mockData';

interface ParkingMapProps {
  spots: ParkingSpot[];
  onSpotClick: (spot: ParkingSpot) => void;
}

const ParkingMap: React.FC<ParkingMapProps> = ({ spots, onSpotClick }) => {
  const [hoveredSpot, setHoveredSpot] = useState<ParkingSpot | null>(null);

  // Group spots by row
  const rows = spots.reduce((acc, spot) => {
    const rowId = spot.id.charAt(0);
    if (!acc[rowId]) {
      acc[rowId] = [];
    }
    acc[rowId].push(spot);
    return acc;
  }, {} as Record<string, ParkingSpot[]>);

  const getVehicleInfo = (spot: ParkingSpot): Vehicle | undefined => {
    if (spot.vehicleId) {
      return getVehicleById(spot.vehicleId);
    }
    return undefined;
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Parking Map</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="mb-4 flex space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-valet-success rounded-full mr-2"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-valet-danger rounded-full mr-2"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-valet-pending rounded-full mr-2"></div>
              <span className="text-sm">Reserved</span>
            </div>
          </div>

          <div className="space-y-3">
            {Object.keys(rows).map(rowId => (
              <div key={rowId} className="flex items-center">
                <div className="w-6 font-bold mr-2">{rowId}</div>
                <div className="flex space-x-2 flex-wrap">
                  {rows[rowId].map(spot => {
                    const vehicle = getVehicleInfo(spot);
                    return (
                      <TooltipProvider key={spot.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`
                                parking-spot w-12 h-12 flex items-center justify-center rounded-md cursor-pointer border-2
                                ${spot.status === 'available' ? 'bg-valet-success text-white' : 
                                  spot.status === 'occupied' ? 'bg-valet-danger text-white' : 
                                  'bg-valet-pending text-white'}
                                ${hoveredSpot?.id === spot.id ? 'ring-2 ring-offset-2 ring-valet-blue' : ''}
                              `}
                              onClick={() => onSpotClick(spot)}
                              onMouseEnter={() => setHoveredSpot(spot)}
                              onMouseLeave={() => setHoveredSpot(null)}
                            >
                              {spot.id.substring(1)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <div className="p-2">
                              <p className="font-bold">{spot.id}: {spot.location}</p>
                              <StatusBadge status={spot.status} />
                              {vehicle && (
                                <div className="mt-1">
                                  <p className="text-xs">{vehicle.make} {vehicle.model} ({vehicle.color})</p>
                                  <p className="text-xs">Plate: {vehicle.licensePlate}</p>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-gray-300 pt-2">
            <p className="text-sm text-center font-semibold">ENTRANCE/EXIT</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingMap;
