
import axios from 'axios';
import { Vehicle } from '@/types';

const API_URL = 'http://localhost:3001/api';

export interface VehicleResponse {
  success: boolean;
  data: Vehicle[];
}

/**
 * Fetches all vehicles from the API
 */
export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await axios.get<VehicleResponse>(`${API_URL}/vehicles`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

/**
 * Fetches a specific vehicle by license plate
 */
export const getVehicleByLicensePlate = async (licensePlate: string): Promise<Vehicle | null> => {
  try {
    const vehicles = await getVehicles();
    return vehicles.find(vehicle => vehicle.licensePlate === licensePlate) || null;
  } catch (error) {
    console.error(`Error fetching vehicle with license plate ${licensePlate}:`, error);
    throw error;
  }
};

