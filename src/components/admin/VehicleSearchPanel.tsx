
import React, { useState } from 'react';
import { Vehicle } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface VehicleSearchPanelProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicle: Vehicle) => void;
}

const VehicleSearchPanel: React.FC<VehicleSearchPanelProps> = ({ 
  vehicles, 
  onVehicleSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    const results = vehicles.filter(vehicle => 
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.ownerPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
    setHasSearched(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="License plate, customer name, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-4 pr-4 py-2"
          />
          <span className="text-xs text-gray-500 mt-1 block">Press Enter</span>
        </div>
        <Button 
          onClick={handleSearch} 
          className="bg-valet-blue hover:bg-valet-blue/90"
        >
          <Search size={18} />
          <span className="ml-2">Search</span>
        </Button>
      </div>

      {!hasSearched && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400">
          <Search size={48} strokeWidth={1} className="mb-4" />
          <p>Search for a vehicle by license plate, customer name, or phone</p>
        </div>
      )}

      {hasSearched && searchResults.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No vehicles found matching your search.</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-4 mt-2">
          {searchResults.map((vehicle) => (
            <div 
              key={vehicle.id} 
              className="border rounded-md p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
              onClick={() => onVehicleSelect(vehicle)}
            >
              <div>
                <div className="font-medium">{vehicle.licensePlate}</div>
                <div className="text-sm text-gray-600">
                  {vehicle.make} {vehicle.model} · {vehicle.ownerName}
                </div>
                {vehicle.parkingSpot && (
                  <div className="text-xs text-gray-500 mt-1">
                    Spot: {vehicle.parkingSpot}
                  </div>
                )}
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onVehicleSelect(vehicle);
                }}
              >
                Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleSearchPanel;
