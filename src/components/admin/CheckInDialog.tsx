
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ParkingSpot } from '@/types';
import { toast } from "sonner";

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSpots: ParkingSpot[];
  onCheckIn: (vehicleData: any) => void;
}

const CheckInDialog: React.FC<CheckInDialogProps> = ({
  open,
  onOpenChange,
  availableSpots,
  onCheckIn
}) => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    make: '',
    model: '',
    color: '',
    ownerName: '',
    ownerPhone: '',
    parkingSpot: '',
    notes: ''
  });
  const [processing, setProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Basic validation
    if (!formData.licensePlate || !formData.ownerName || !formData.parkingSpot) {
      toast.error("Please fill in all required fields");
      setProcessing(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      onCheckIn({
        ...formData,
        id: Date.now().toString(),
        status: 'checked-in',
        checkInTime: new Date()
      });
      
      // Reset form and close dialog
      setFormData({
        licensePlate: '',
        make: '',
        model: '',
        color: '',
        ownerName: '',
        ownerPhone: '',
        parkingSpot: '',
        notes: ''
      });
      setProcessing(false);
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Check In Vehicle</DialogTitle>
          <DialogDescription>
            Enter the vehicle and customer information to check in a new vehicle.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate*</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                placeholder="ABC123"
                value={formData.licensePlate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parkingSpot">Parking Spot*</Label>
              <Select 
                value={formData.parkingSpot} 
                onValueChange={(value) => handleSelectChange('parkingSpot', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a spot" />
                </SelectTrigger>
                <SelectContent>
                  {availableSpots.map(spot => (
                    <SelectItem key={spot.id} value={spot.id}>
                      {spot.id} - {spot.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                name="make"
                placeholder="Toyota"
                value={formData.make}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                placeholder="Camry"
                value={formData.model}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                name="color"
                placeholder="Silver"
                value={formData.color}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name*</Label>
              <Input
                id="ownerName"
                name="ownerName"
                placeholder="John Doe"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Owner Phone</Label>
              <Input
                id="ownerPhone"
                name="ownerPhone"
                placeholder="555-123-4567"
                value={formData.ownerPhone}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Special instructions or notes about the vehicle"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Processing...' : 'Check In Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInDialog;
