
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-valet-success';
      case 'occupied':
      case 'retrieved':
        return 'bg-valet-danger';
      case 'pending':
      case 'pending-retrieval':
        return 'bg-valet-warning';
      case 'processing':
      case 'checked-in':
        return 'bg-valet-pending';
      default:
        return 'bg-valet-gray';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'checked-in':
        return 'Checked In';
      case 'pending-retrieval':
        return 'Retrieval Requested';
      case 'retrieved':
        return 'Retrieved';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-white text-xs font-medium",
      getStatusClass(status),
      className
    )}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
