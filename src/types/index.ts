
export interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  ownerName: string;
  ownerPhone: string;
  parkingSpot?: string;
  status: 'checked-in' | 'pending-retrieval' | 'retrieved';
  checkInTime: Date;
  retrievalTime?: Date;
  notes?: string;
}

export interface ParkingSpot {
  id: string;
  location: string;
  status: 'available' | 'occupied' | 'reserved';
  vehicleId?: string;
}

export interface ParkingStatistics {
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  vehiclesProcessed: number;
  averageParkingDuration: number;
  revenue: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'attendant' | 'customer';
}

export interface RetrievalRequest {
  id: string;
  vehicleId: string;
  requestTime: Date;
  estimatedTime: Date;
  status: 'pending' | 'processing' | 'completed';
  attendantId?: string;
}
