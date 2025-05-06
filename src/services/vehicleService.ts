
import axios from 'axios';
import { Vehicle } from '@/types';

const API_URL = 'http://localhost:3001/api';

export interface VehicleResponse {
  success: boolean;
  data: Vehicle[];
}

export interface SingleVehicleResponse {
  success: boolean;
  data: Vehicle;
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
    const response = await axios.get<SingleVehicleResponse>(`${API_URL}/vehicles/${licensePlate}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching vehicle with license plate ${licensePlate}:`, error);
    return null;
  }
};

/**
 * Submits a vehicle check-in
 */
export const checkInVehicle = async (vehicleData: Partial<Vehicle>): Promise<Vehicle> => {
  try {
    const response = await axios.post<SingleVehicleResponse>(`${API_URL}/vehicles`, vehicleData);
    return response.data.data;
  } catch (error) {
    console.error('Error checking in vehicle:', error);
    throw error;
  }
};

/**
 * Updates a vehicle's status
 */
export const updateVehicleStatus = async (id: string, status: Vehicle['status']): Promise<Vehicle> => {
  try {
    const response = await axios.patch<SingleVehicleResponse>(`${API_URL}/vehicles/${id}/status`, { status });
    return response.data.data;
  } catch (error) {
    console.error(`Error updating vehicle status for ${id}:`, error);
    throw error;
  }
};
