
import React from 'react';
import { RetrievalRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { getVehicleById } from '@/data/mockData';
import { toast } from 'sonner';

interface RetrievalRequestsProps {
  requests: RetrievalRequest[];
  onProcessRequest: (request: RetrievalRequest) => void;
}

const RetrievalRequests: React.FC<RetrievalRequestsProps> = ({ requests, onProcessRequest }) => {
  const formatTimeLeft = (eta: Date): string => {
    const now = new Date();
    const diffMs = eta.getTime() - now.getTime();
    const diffMinutes = Math.round(diffMs / 60000);
    
    if (diffMinutes <= 0) return 'Now';
    return `${diffMinutes} min`;
  };

  const handleProcess = (request: RetrievalRequest) => {
    onProcessRequest(request);
    toast.success("Processing retrieval request");
  };

  if (requests.length === 0) {
    return (
      <Card className="col-span-full animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Retrieval Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No pending retrieval requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Retrieval Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => {
            const vehicle = getVehicleById(request.vehicleId);
            
            if (!vehicle) return null;
            
            return (
              <div 
                key={request.id} 
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border-l-4 border-valet-warning animate-fade-in"
              >
                <div>
                  <div className="font-medium">
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {vehicle.ownerName} • Spot: {vehicle.parkingSpot || 'Unknown'}
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium text-valet-warning">
                      <Clock size={14} />
                      <span>ETA: {formatTimeLeft(request.estimatedTime)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => handleProcess(request)}
                    disabled={request.status === 'processing'}
                  >
                    {request.status === 'processing' ? 'Processing...' : 'Process'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RetrievalRequests;
