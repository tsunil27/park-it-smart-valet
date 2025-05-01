
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
