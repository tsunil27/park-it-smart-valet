
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import StatisticsCards from '@/components/admin/StatisticsCards';
import ParkingMap from '@/components/admin/ParkingMap';
import VehicleList from '@/components/admin/VehicleList';
import VehicleDetailsDialog from '@/components/admin/VehicleDetailsDialog';
import CheckInDialog from '@/components/admin/CheckInDialog';
import RetrievalRequests from '@/components/admin/RetrievalRequests';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vehicle, ParkingSpot, RetrievalRequest } from '@/types';
import { 
  mockVehicles, mockParkingSpots, mockStatistics, mockRetrievalRequests 
} from '@/data/mockData';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  
  // State
  const [statistics, setStatistics] = useState(mockStatistics);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(mockParkingSpots);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [retrievalRequests, setRetrievalRequests] = useState<RetrievalRequest[]>(mockRetrievalRequests);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);

  useEffect(() => {
    // Update statistics whenever vehicles or parking spots change
    setStatistics({
      ...statistics,
      availableSpots: parkingSpots.filter(spot => spot.status === 'available').length,
      occupiedSpots: parkingSpots.filter(spot => spot.status === 'occupied').length
    });
  }, [vehicles, parkingSpots]);

  // If not logged in or not an admin/attendant, redirect to login
  if (!isAuthenticated || (role !== 'admin' && role !== 'attendant')) {
    return <Navigate to="/login" replace />;
  }

  const handleSpotClick = (spot: ParkingSpot) => {
    // If spot is occupied, find the vehicle and show details
    if (spot.status === 'occupied' && spot.vehicleId) {
      const vehicle = vehicles.find(v => v.id === spot.vehicleId);
      if (vehicle) {
        setSelectedVehicle(vehicle);
        setIsDetailsDialogOpen(true);
      }
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailsDialogOpen(true);
  };

  const handleVehicleStatusChange = (vehicle: Vehicle, newStatus: Vehicle['status']) => {
    // Update vehicle status
    const updatedVehicles = vehicles.map(v => 
      v.id === vehicle.id ? { ...v, status: newStatus, retrievalTime: newStatus === 'retrieved' ? new Date() : undefined } : v
    );
    setVehicles(updatedVehicles);

    // If retrieved, update parking spot status
    if (newStatus === 'retrieved' && vehicle.parkingSpot) {
      const updatedSpots = parkingSpots.map(spot => 
        spot.id === vehicle.parkingSpot ? { ...spot, status: 'available', vehicleId: undefined } : spot
      );
      setParkingSpots(updatedSpots);
    }

    // If a retrieval request exists for this vehicle, remove it
    if (newStatus === 'retrieved') {
      const updatedRequests = retrievalRequests.filter(req => req.vehicleId !== vehicle.id);
      setRetrievalRequests(updatedRequests);
    }
  };

  const handleCheckIn = (vehicleData: Vehicle) => {
    // Create new vehicle
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `v-${Date.now()}`,
      status: 'checked-in',
      checkInTime: new Date()
    };
    setVehicles([...vehicles, newVehicle]);

    // Update parking spot
    if (vehicleData.parkingSpot) {
      const updatedSpots = parkingSpots.map(spot => 
        spot.id === vehicleData.parkingSpot ? { ...spot, status: 'occupied', vehicleId: newVehicle.id } : spot
      );
      setParkingSpots(updatedSpots);
    }

    toast.success(`Vehicle ${vehicleData.licensePlate} successfully checked in`);
  };

  const handleProcessRequest = (request: RetrievalRequest) => {
    // Update request status
    const updatedRequests = retrievalRequests.map(req => 
      req.id === request.id ? { ...req, status: 'processing' } : req
    );
    setRetrievalRequests(updatedRequests);

    // Update vehicle status
    const updatedVehicles = vehicles.map(v => 
      v.id === request.vehicleId ? { ...v, status: 'pending-retrieval' } : v
    );
    setVehicles(updatedVehicles);
  };

  // Filter available spots for check-in
  const availableSpots = parkingSpots.filter(spot => spot.status === 'available');

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Valet Admin Dashboard</h1>
          <p className="text-gray-500">Manage vehicle check-ins, retrievals, and parking status</p>
        </div>
        <Button onClick={() => setIsCheckInDialogOpen(true)} className="bg-valet-blue hover:bg-valet-blue/90">
          Check In New Vehicle
        </Button>
      </div>

      {/* Retrieval Requests Alert */}
      {retrievalRequests.length > 0 && (
        <div className="mb-6">
          <RetrievalRequests 
            requests={retrievalRequests}
            onProcessRequest={handleProcessRequest}
          />
        </div>
      )}

      {/* Statistics Cards */}
      <div className="mb-8">
        <StatisticsCards statistics={statistics} />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="mb-4 bg-gray-100">
          <TabsTrigger value="map">Parking Map</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="mt-0">
          <div className="grid grid-cols-1">
            <ParkingMap spots={parkingSpots} onSpotClick={handleSpotClick} />
          </div>
        </TabsContent>
        
        <TabsContent value="vehicles" className="mt-0">
          <VehicleList 
            vehicles={vehicles} 
            onVehicleSelect={handleVehicleSelect} 
          />
        </TabsContent>
      </Tabs>

      {/* Vehicle Details Dialog */}
      <VehicleDetailsDialog 
        vehicle={selectedVehicle} 
        open={isDetailsDialogOpen} 
        onOpenChange={setIsDetailsDialogOpen} 
        onStatusChange={handleVehicleStatusChange}
      />

      {/* Check-In Dialog */}
      <CheckInDialog 
        open={isCheckInDialogOpen}
        onOpenChange={setIsCheckInDialogOpen}
        availableSpots={availableSpots}
        onCheckIn={handleCheckIn}
      />
    </div>
  );
};

export default AdminDashboard;
