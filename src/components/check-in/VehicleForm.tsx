
import React, { useState } from 'react';
import { Vehicle } from '@/types';
import { Button } from '@/components/ui/button';
import FormField from './FormField';
import { toast } from 'sonner';
import { checkInVehicle } from '@/services/vehicleService';
import { CarFront, Phone } from 'lucide-react';

interface VehicleFormProps {
  onSuccess: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    licensePlate: '',
    make: '',
    model: '',
    color: '',
    ownerName: '',
    ownerPhone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.licensePlate || !formData.ownerName || !formData.ownerPhone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const checkInTime = new Date();
      const newVehicle = {
        ...formData,
        id: `v-${Date.now()}`,
        status: 'checked-in' as const,
        checkInTime
      };
      
      await checkInVehicle(newVehicle);
      
      toast.success('Vehicle checked in successfully!', {
        description: `Ticket created for ${formData.licensePlate}`
      });
      
      // Reset form
      setFormData({
        licensePlate: '',
        make: '',
        model: '',
        color: '',
        ownerName: '',
        ownerPhone: '',
        notes: ''
      });
      
      // Notify parent of success
      onSuccess();
    } catch (error) {
      toast.error('Failed to check in vehicle', {
        description: 'Please try again'
      });
      console.error('Error checking in vehicle:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          id="licensePlate"
          label="License Plate"
          value={formData.licensePlate}
          onChange={handleChange}
          placeholder="e.g. ABC-123"
          required
          icon={<CarFront size={18} />}
        />
        
        <FormField
          id="color"
          label="Color"
          value={formData.color}
          onChange={handleChange}
          placeholder="e.g. Silver"
        />
        
        <FormField
          id="make"
          label="Make"
          value={formData.make}
          onChange={handleChange}
          placeholder="e.g. Toyota"
        />
        
        <FormField
          id="model"
          label="Model"
          value={formData.model}
          onChange={handleChange}
          placeholder="e.g. Camry"
        />
        
        <FormField
          id="ownerName"
          label="Customer Name"
          value={formData.ownerName}
          onChange={handleChange}
          placeholder="e.g. John Doe"
          required
        />
        
        <FormField
          id="ownerPhone"
          label="Phone Number"
          value={formData.ownerPhone}
          onChange={handleChange}
          placeholder="e.g. 555-123-4567"
          required
          icon={<Phone size={18} />}
        />
      </div>
      
      <FormField
        id="notes"
        label="Notes"
        value={formData.notes || ''}
        onChange={handleChange}
        placeholder="Any special instructions or vehicle details..."
        type="textarea"
      />
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full bg-valet-blue" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Check In Vehicle'}
        </Button>
      </div>
    </form>
  );
};

export default VehicleForm;
