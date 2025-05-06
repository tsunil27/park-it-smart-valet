
import axios from 'axios';
import { Vehicle } from '@/types';

const API_URL = 'http://localhost:3001/api';

export const requestVehicleRetrieval = async (licensePlate: string, phoneNumber: string) => {
  try {
    const response = await axios.post(`${API_URL}/retrieval`, { 
      licensePlate, 
      phoneNumber 
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting vehicle retrieval:', error);
    throw error;
  }
};

export const getVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    throw error;
  }
};

export const getVehicleByLicensePlate = async (licensePlate: string): Promise<Vehicle | null> => {
  try {
    const response = await axios.get(`${API_URL}/vehicles/${licensePlate}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching vehicle with license plate ${licensePlate}:`, error);
    return null;
  }
};
