
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ParkingStatistics } from '@/types';

interface StatisticsCardsProps {
  statistics: ParkingStatistics;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600">Available Spots</p>
              <h2 className="text-3xl font-bold mt-2">{statistics.availableSpots}</h2>
              <p className="text-sm text-gray-500">{Math.round((statistics.availableSpots / statistics.totalSpots) * 100)}% Occupancy Rate</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600">Active Vehicles</p>
              <h2 className="text-3xl font-bold mt-2">{statistics.occupiedSpots}</h2>
              <p className="text-sm text-gray-500">{statistics.vehiclesProcessed} Being Retrieved</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1-.9-1-1.9V7c0-.5.4-1 1-1h2"/><path d="M7 7H5c-.6 0-1 .4-1 1v3c0 .9.7 1.7 1.5 1.9C7.3 13.4 10 14 10 14s1 .9 1 1.9V17c0 .5-.4 1-1 1H8"/><path d="M14 3v3"/><path d="M14 18v3"/><path d="M3 9v6"/><path d="M21 9v6"/></svg>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600">Completed Today</p>
              <h2 className="text-3xl font-bold mt-2">{statistics.vehiclesProcessed}</h2>
              <p className="text-sm text-gray-500">Total Check-outs</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-full text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600">Revenue</p>
              <h2 className="text-3xl font-bold mt-2">${statistics.revenue.toFixed(0)}</h2>
              <p className="text-sm text-gray-500">Daily earnings</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-full text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
