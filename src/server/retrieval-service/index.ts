
import express from 'express';
import cors from 'cors';
import { Vehicle } from '../../types';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data (in a real app, this would come from a database)
const vehicles: Vehicle[] = [
  {
    id: 'v001',
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
    id: 'v002',
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
    id: 'v003',
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
  }
];

// Retrieval requests
const retrievalRequests: {
  id: string;
  licensePlate: string;
  phoneNumber: string;
  requestTime: Date;
  estimatedTime: Date;
  status: 'pending' | 'processing' | 'completed';
}[] = [];

// GET /api/vehicles - Get all vehicles
app.get('/api/vehicles', (req, res) => {
  res.json({
    success: true,
    data: vehicles
  });
});

// GET /api/vehicles/:licensePlate - Get vehicle by license plate
app.get('/api/vehicles/:licensePlate', (req, res) => {
  const { licensePlate } = req.params;
  const vehicle = vehicles.find(v => v.licensePlate.toLowerCase() === licensePlate.toLowerCase());
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: `Vehicle with license plate ${licensePlate} not found`
    });
  }
  
  res.json({
    success: true,
    data: vehicle
  });
});

// POST /api/vehicles - Check in a new vehicle
app.post('/api/vehicles', (req, res) => {
  const vehicleData = req.body;
  
  // Generate a unique ID
  const newVehicle: Vehicle = {
    ...vehicleData,
    id: `v${Date.now()}`,
    status: 'checked-in',
    checkInTime: new Date()
  };
  
  vehicles.push(newVehicle);
  
  res.status(201).json({
    success: true,
    data: newVehicle
  });
});

// PATCH /api/vehicles/:id/status - Update vehicle status
app.patch('/api/vehicles/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const vehicleIndex = vehicles.findIndex(v => v.id === id);
  
  if (vehicleIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Vehicle with ID ${id} not found`
    });
  }
  
  vehicles[vehicleIndex] = {
    ...vehicles[vehicleIndex],
    status,
    retrievalTime: status === 'retrieved' ? new Date() : vehicles[vehicleIndex].retrievalTime
  };
  
  res.json({
    success: true,
    data: vehicles[vehicleIndex]
  });
});

// POST /api/retrieval - Request vehicle retrieval
app.post('/api/retrieval', (req, res) => {
  const { licensePlate, phoneNumber } = req.body;
  
  // Find the vehicle
  const vehicle = vehicles.find(v => 
    v.licensePlate.toLowerCase() === licensePlate.toLowerCase() && 
    v.ownerPhone === phoneNumber
  );
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'Vehicle not found or phone number does not match'
    });
  }
  
  // Create retrieval request
  const requestTime = new Date();
  const estimatedTime = new Date(requestTime);
  estimatedTime.setMinutes(estimatedTime.getMinutes() + 5); // 5 minutes ETA
  
  const retrievalRequest = {
    id: `req-${Date.now()}`,
    licensePlate,
    phoneNumber,
    requestTime,
    estimatedTime,
    status: 'pending' as const
  };
  
  retrievalRequests.push(retrievalRequest);
  
  // Update vehicle status
  const vehicleIndex = vehicles.findIndex(v => v.id === vehicle.id);
  vehicles[vehicleIndex] = {
    ...vehicles[vehicleIndex],
    status: 'pending-retrieval'
  };
  
  res.json({
    success: true,
    data: {
      vehicle: vehicles[vehicleIndex],
      estimatedTime
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Retrieval service running on http://localhost:${PORT}`);
});
