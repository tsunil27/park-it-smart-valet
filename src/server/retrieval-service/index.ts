
import express from 'express';
import cors from 'cors';
import { Vehicle } from '../../types';

// Define the RetrievalRequest type locally to avoid any import issues
interface RetrievalRequest {
  id: string;
  vehicleId: string;
  requestTime: Date;
  estimatedTime: Date;
  status: 'pending' | 'processing' | 'completed';
  attendantId?: string;
}

const app = express();
const PORT = 3001;

// Mock data - in a real app, this would come from a database
let mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    licensePlate: 'ABC123',
    make: 'Toyota',
    model: 'Camry',
    color: 'Blue',
    ownerName: 'John Smith',
    ownerPhone: '555-1234',
    parkingSpot: 'A1',
    status: 'checked-in',
    checkInTime: new Date(),
  },
  {
    id: 'v2',
    licensePlate: 'XYZ789',
    make: 'Honda',
    model: 'Accord',
    color: 'Red',
    ownerName: 'Jane Doe',
    ownerPhone: '555-5678',
    parkingSpot: 'B2',
    status: 'checked-in',
    checkInTime: new Date(),
  }
];

// Middleware
app.use(cors());
app.use(express.json());

// NEW API endpoint to get all vehicles and their status
app.get('/api/vehicles', (req, res) => {
  return res.status(200).json({
    success: true,
    data: mockVehicles
  });
});

// API endpoint to handle vehicle retrieval requests
app.post('/api/retrieval', (req, res) => {
  const { licensePlate, phoneNumber } = req.body;
  
  // Find the vehicle by license plate and phone number
  const foundVehicleIndex = mockVehicles.findIndex(
    v => v.licensePlate.toLowerCase() === licensePlate.toLowerCase() && 
         v.ownerPhone === phoneNumber &&
         v.status === 'checked-in'
  );
  
  if (foundVehicleIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Vehicle not found or not eligible for retrieval' 
    });
  }
  
  const foundVehicle = mockVehicles[foundVehicleIndex];
  
  // Calculate estimated time (5 minutes from now)
  const eta = new Date();
  eta.setMinutes(eta.getMinutes() + 5);
  
  // Update vehicle status to pending-retrieval
  mockVehicles[foundVehicleIndex] = {
    ...foundVehicle,
    status: 'pending-retrieval'
  };
  
  // Create retrieval request
  const newRequest: RetrievalRequest = {
    id: `req-${Date.now()}`,
    vehicleId: foundVehicle.id,
    requestTime: new Date(),
    estimatedTime: eta,
    status: 'pending'
  };
  
  // In a real app, we would persist this request
  console.log('Created retrieval request:', newRequest);
  console.log('Updated vehicle status to pending-retrieval:', mockVehicles[foundVehicleIndex]);
  
  return res.status(200).json({
    success: true,
    message: 'Vehicle retrieval requested successfully',
    data: {
      vehicle: {
        ...mockVehicles[foundVehicleIndex],
        status: 'pending-retrieval'
      },
      estimatedTime: eta
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Retrieval service running on port ${PORT}`);
});

export default app;
