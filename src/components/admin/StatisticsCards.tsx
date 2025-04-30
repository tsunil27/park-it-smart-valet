
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ParkingStatistics } from '@/types';

interface StatisticsCardsProps {
  statistics: ParkingStatistics;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-valet-blue to-blue-800 text-white">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Occupancy Rate</h3>
          <div className="mt-2">
            <div className="text-3xl font-bold">
              {Math.round((statistics.occupiedSpots / statistics.totalSpots) * 100)}%
            </div>
            <div className="text-sm mt-1">
              {statistics.occupiedSpots} / {statistics.totalSpots} spots filled
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full mt-3">
              <div 
                className="bg-white h-2 rounded-full"
                style={{ width: `${(statistics.occupiedSpots / statistics.totalSpots) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Available Spots</h3>
          <div className="mt-2">
            <div className="text-3xl font-bold text-valet-success">
              {statistics.availableSpots}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Ready for new vehicles
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Vehicles Processed</h3>
          <div className="mt-2">
            <div className="text-3xl font-bold">
              {statistics.vehiclesProcessed}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Total vehicles today
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Average Duration</h3>
          <div className="mt-2">
            <div className="text-3xl font-bold">
              {statistics.averageParkingDuration} min
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Average parking time
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Today's Revenue</h3>
          <div className="mt-2">
            <div className="text-3xl font-bold">
              ${statistics.revenue.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Total earnings
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-valet-success to-green-700 text-white">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium">Performance</h3>
          <div className="mt-2">
            <div className="text-3xl font-bold">
              Good
            </div>
            <div className="text-sm mt-1">
              Operations running smoothly
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
