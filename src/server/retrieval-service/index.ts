
import { Vehicle } from '../../types';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS and JSON parsing
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
    checkInTime: new Date(Date.now() - 3600000), // 1 hour ago
    notes: 'Scratch on rear bumper'
  },
  {
    id: 'v002',
    licensePlate: 'XYZ789',
    make: 'Honda',
    model: 'Civic',
    color: 'Blue',
    ownerName: 'Jane Smith',
    ownerPhone: '555-987-6543',
    parkingSpot: 'B3',
    status: 'pending-retrieval',
    checkInTime: new Date(Date.now() - 7200000), // 2 hours ago
    retrievalTime: new Date(Date.now() + 600000), // 10 minutes from now
    notes: 'Keys in ignition'
  },
  {
    id: 'v003',
    licensePlate: 'DEF456',
    make: 'Tesla',
    model: 'Model 3',
    color: 'Red',
    ownerName: 'Sam Wilson',
    ownerPhone: '555-555-5555',
    parkingSpot: 'C2',
    status: 'retrieved',
    checkInTime: new Date(Date.now() - 10800000), // 3 hours ago
    retrievalTime: new Date(Date.now() - 1800000), // 30 minutes ago
    notes: 'EV - requires charging'
  }
];

// API endpoint to get all vehicles
app.get('/api/vehicles', (req, res) => {
  res.json({
    success: true,
    data: vehicles
  });
});

// API endpoint to get a specific vehicle by license plate
app.get('/api/vehicles/:licensePlate', (req, res) => {
  const { licensePlate } = req.params;
  const vehicle = vehicles.find(v => v.licensePlate.toLowerCase() === licensePlate.toLowerCase());
  
  if (vehicle) {
    res.json({
      success: true,
      data: vehicle
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Vehicle not found'
    });
  }
});

// API endpoint for vehicle retrieval requests
app.post('/api/retrieval', (req, res) => {
  const { licensePlate, phoneNumber } = req.body;
  
  if (!licensePlate || !phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'License plate and phone number are required'
    });
  }
  
  const vehicle = vehicles.find(v => 
    v.licensePlate.toLowerCase() === licensePlate.toLowerCase() && 
    v.ownerPhone === phoneNumber
  );
  
  if (!vehicle) {
    return res.status(404).json({
      success: false,
      message: 'No matching vehicle found'
    });
  }
  
  if (vehicle.status === 'retrieved') {
    return res.status(400).json({
      success: false,
      message: 'Vehicle has already been retrieved'
    });
  }
  
  // Update vehicle status
  vehicle.status = 'pending-retrieval';
  vehicle.retrievalTime = new Date(Date.now() + 300000); // 5 minutes from now
  
  return res.json({
    success: true,
    message: 'Vehicle retrieval requested',
    data: {
      vehicle,
      estimatedTime: vehicle.retrievalTime
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Retrieval service running on http://localhost:${PORT}`);
});

