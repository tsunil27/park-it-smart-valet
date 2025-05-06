
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { checkInVehicle } from '@/services/vehicleService';
import { Vehicle } from '@/types';

const CheckInPage: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  
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
  
  // Redirect if not authenticated or not staff
  React.useEffect(() => {
    if (!isAuthenticated || (role !== 'admin' && role !== 'attendant')) {
      navigate('/login');
    }
  }, [isAuthenticated, role, navigate]);
  
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
      
      // In a real app, this would call the API to check in the vehicle
      // For now, we'll just simulate success
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
      
      // Navigate to admin dashboard
      navigate('/admin');
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
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 text-center">Vehicle Check-In</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Enter Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">License Plate *</Label>
                  <Input
                    id="licensePlate"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleChange}
                    placeholder="e.g. ABC-123"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g. Silver"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="make">Make</Label>
                  <Input
                    id="make"
                    name="make"
                    value={formData.make}
                    onChange={handleChange}
                    placeholder="e.g. Toyota"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. Camry"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerName">Customer Name *</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Phone Number *</Label>
                  <Input
                    id="ownerPhone"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleChange}
                    placeholder="e.g. 555-123-4567"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  placeholder="Any special instructions or vehicle details..."
                  rows={3}
                />
              </div>
              
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckInPage;
