import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import StatisticsCards from '@/components/admin/StatisticsCards';
import ParkingMap from '@/components/admin/ParkingMap';
import VehicleList from '@/components/admin/VehicleList';
import VehicleDetailsDialog from '@/components/admin/VehicleDetailsDialog';
import CheckInDialog from '@/components/admin/CheckInDialog';
import RetrievalRequests from '@/components/admin/RetrievalRequests';
import VehicleSearchPanel from '@/components/admin/VehicleSearchPanel';
import { Button } from '@/components/ui/button';
import { Vehicle, ParkingSpot, RetrievalRequest } from '@/types';
import { 
  mockVehicles, mockParkingSpots, mockStatistics, mockRetrievalRequests 
} from '@/data/mockData';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

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
    
    // Add event listener for opening check-in dialog from navbar
    const handleOpenCheckInDialog = () => setIsCheckInDialogOpen(true);
    document.addEventListener('openCheckInDialog', handleOpenCheckInDialog);
    
    return () => {
      document.removeEventListener('openCheckInDialog', handleOpenCheckInDialog);
    };
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
        spot.id === vehicle.parkingSpot 
          ? { ...spot, status: 'available' as const, vehicleId: undefined } 
          : spot
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
        spot.id === vehicleData.parkingSpot 
          ? { ...spot, status: 'occupied' as const, vehicleId: newVehicle.id } 
          : spot
      );
      setParkingSpots(updatedSpots);
    }

    toast.success(`Vehicle ${vehicleData.licensePlate} successfully checked in`);
  };

  const handleProcessRequest = (request: RetrievalRequest) => {
    // Update request status
    const updatedRequests = retrievalRequests.map(req => 
      req.id === request.id 
        ? { ...req, status: 'processing' as const } 
        : req
    );
    setRetrievalRequests(updatedRequests);

    // Update vehicle status
    const updatedVehicles = vehicles.map(v => 
      v.id === request.vehicleId 
        ? { ...v, status: 'pending-retrieval' as const } 
        : v
    );
    setVehicles(updatedVehicles);
  };

  // Filter available spots for check-in
  const availableSpots = parkingSpots.filter(spot => spot.status === 'available');
  
  // Calculate active vehicles (checked-in and pending-retrieval)
  const activeVehicles = vehicles.filter(v => v.status === 'checked-in' || v.status === 'pending-retrieval');
  
  // Count completed vehicles (retrieved)
  const completedToday = vehicles.filter(v => {
    if (v.retrievalTime) {
      const today = new Date();
      const retrievalDate = new Date(v.retrievalTime);
      return retrievalDate.getDate() === today.getDate() && 
             retrievalDate.getMonth() === today.getMonth() && 
             retrievalDate.getFullYear() === today.getFullYear();
    }
    return false;
  }).length;

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <Button onClick={() => setIsCheckInDialogOpen(true)} className="bg-valet-blue hover:bg-valet-blue/90">
          Check In New Vehicle
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600">Available Spots</p>
                <h2 className="text-3xl font-bold mt-2">{statistics.availableSpots}</h2>
                <p className="text-sm text-gray-500">{Math.round((statistics.availableSpots / statistics.totalSpots) * 100)}% Occupancy Rate</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600">Active Vehicles</p>
                <h2 className="text-3xl font-bold mt-2">{activeVehicles.length}</h2>
                <p className="text-sm text-gray-500">{retrievalRequests.length} Being Retrieved</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1-.9-1-1.9V7c0-.5.4-1 1-1h2"/><path d="M7 7H5c-.6 0-1 .4-1 1v3c0 .9.7 1.7 1.5 1.9C7.3 13.4 10 14 10 14s1 .9 1 1.9V17c0 .5-.4 1-1 1H8"/><path d="M14 3v3"/><path d="M14 18v3"/><path d="M3 9v6"/><path d="M21 9v6"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600">Completed Today</p>
                <h2 className="text-3xl font-bold mt-2">{completedToday}</h2>
                <p className="text-sm text-gray-500">Total Check-outs</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600">Revenue</p>
                <h2 className="text-3xl font-bold mt-2">${statistics.revenue.toFixed(0)}</h2>
                <p className="text-sm text-gray-500">Daily earnings</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <h2 className="text-xl font-semibold p-4 border-b">Active Vehicles</h2>
              <VehicleList 
                vehicles={activeVehicles} 
                onVehicleSelect={handleVehicleSelect}
                showRetrieveButton 
              />
            </CardContent>
          </Card>
          
          <Card className="shadow-sm mt-6">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Parking Map</h2>
              <ParkingMap spots={parkingSpots} onSpotClick={handleSpotClick} />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="shadow-sm h-full">
            <CardContent className="p-0">
              <h2 className="text-xl font-semibold p-4 border-b">Vehicle Search</h2>
              <VehicleSearchPanel vehicles={vehicles} onVehicleSelect={handleVehicleSelect} />
            </CardContent>
          </Card>
        </div>
      </div>

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
