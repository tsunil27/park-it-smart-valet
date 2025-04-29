
import { Vehicle, ParkingSpot, ParkingStatistics, User, RetrievalRequest } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@parkit.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Valet Attendant',
    email: 'attendant@parkit.com',
    role: 'attendant'
  },
  {
    id: '3',
    name: 'John Customer',
    email: 'john@example.com',
    role: 'customer'
  }
];

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    licensePlate: 'ABC123',
    make: 'Toyota',
    model: 'Camry',
    color: 'Silver',
    ownerName: 'John Doe',
    ownerPhone: '555-123-4567',
    parkingSpot: 'A1',
    status: 'checked-in',
    checkInTime: new Date('2023-04-29T10:30:00'),
    notes: 'Keys in ignition'
  },
  {
    id: '2',
    licensePlate: 'XYZ789',
    make: 'Honda',
    model: 'Accord',
    color: 'Black',
    ownerName: 'Jane Smith',
    ownerPhone: '555-987-6543',
    parkingSpot: 'B3',
    status: 'checked-in',
    checkInTime: new Date('2023-04-29T11:15:00'),
    notes: 'Scratch on passenger door'
  },
  {
    id: '3',
    licensePlate: 'DEF456',
    make: 'Tesla',
    model: 'Model 3',
    color: 'White',
    ownerName: 'Robert Johnson',
    ownerPhone: '555-456-7890',
    parkingSpot: 'C2',
    status: 'pending-retrieval',
    checkInTime: new Date('2023-04-29T09:45:00'),
    notes: 'Electric vehicle'
  },
  {
    id: '4',
    licensePlate: 'GHI789',
    make: 'BMW',
    model: 'X5',
    color: 'Blue',
    ownerName: 'Sarah Williams',
    ownerPhone: '555-234-5678',
    parkingSpot: 'D4',
    status: 'checked-in',
    checkInTime: new Date('2023-04-29T12:00:00')
  },
  {
    id: '5',
    licensePlate: 'JKL012',
    make: 'Audi',
    model: 'A4',
    color: 'Red',
    ownerName: 'Michael Brown',
    ownerPhone: '555-876-5432',
    status: 'retrieved',
    checkInTime: new Date('2023-04-29T08:30:00'),
    retrievalTime: new Date('2023-04-29T13:45:00')
  }
];

// Mock Parking Spots
export const mockParkingSpots: ParkingSpot[] = [
  { id: 'A1', location: 'Level 1, Row A, Spot 1', status: 'occupied', vehicleId: '1' },
  { id: 'A2', location: 'Level 1, Row A, Spot 2', status: 'available' },
  { id: 'A3', location: 'Level 1, Row A, Spot 3', status: 'available' },
  { id: 'B1', location: 'Level 1, Row B, Spot 1', status: 'available' },
  { id: 'B2', location: 'Level 1, Row B, Spot 2', status: 'available' },
  { id: 'B3', location: 'Level 1, Row B, Spot 3', status: 'occupied', vehicleId: '2' },
  { id: 'C1', location: 'Level 1, Row C, Spot 1', status: 'available' },
  { id: 'C2', location: 'Level 1, Row C, Spot 2', status: 'occupied', vehicleId: '3' },
  { id: 'C3', location: 'Level 1, Row C, Spot 3', status: 'available' },
  { id: 'D1', location: 'Level 1, Row D, Spot 1', status: 'available' },
  { id: 'D2', location: 'Level 1, Row D, Spot 2', status: 'available' },
  { id: 'D3', location: 'Level 1, Row D, Spot 3', status: 'available' },
  { id: 'D4', location: 'Level 1, Row D, Spot 4', status: 'occupied', vehicleId: '4' },
];

// Mock Parking Statistics
export const mockStatistics: ParkingStatistics = {
  totalSpots: mockParkingSpots.length,
  availableSpots: mockParkingSpots.filter(spot => spot.status === 'available').length,
  occupiedSpots: mockParkingSpots.filter(spot => spot.status === 'occupied').length,
  vehiclesProcessed: 47,
  averageParkingDuration: 120, // minutes
  revenue: 1250.50
};

// Mock Retrieval Requests
export const mockRetrievalRequests: RetrievalRequest[] = [
  {
    id: '1',
    vehicleId: '3',
    requestTime: new Date('2023-04-29T14:30:00'),
    estimatedTime: new Date('2023-04-29T14:35:00'),
    status: 'pending'
  }
];

// Helper function to find vehicle by ID
export const getVehicleById = (id: string): Vehicle | undefined => {
  return mockVehicles.find(vehicle => vehicle.id === id);
};

// Helper function to find parking spot by ID
export const getParkingSpotById = (id: string): ParkingSpot | undefined => {
  return mockParkingSpots.find(spot => spot.id === id);
};

// Helper function to find user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};
