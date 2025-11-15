import React from 'react';
import LiveOrders from './LiveOrders';
import OrderHistory from './OrderHistory';
import OrderStatsCards from '@/components/OrderStatsCards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Activity, History } from 'lucide-react';

export default function Orders() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Enhanced Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm">
              <Activity className="h-6 w-6 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Orders Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor live orders and browse historical activity in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview Cards - Now with Real Data */}
        <OrderStatsCards />

        <Separator className="mb-8 bg-gray-200" />

        {/* Enhanced Content grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* Live Orders */}
          <Card 
            id="live-orders-section"
            className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardHeader className="pb-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-50">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-900">Live Orders</span>
                  <p className="text-sm text-gray-600 font-normal">Real-time order management</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-semibold">Live</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[75vh] overflow-auto">
                <div className="p-6">
                  <LiveOrders />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card 
            id="order-history-section"
            className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <CardHeader className="pb-4 bg-gray-50 rounded-t-lg border-b border-gray-200">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-50">
                  <History className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-900">Order History</span>
                  <p className="text-sm text-gray-600 font-normal">Completed order records</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-semibold">Archive</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[75vh] overflow-auto">
                <div className="p-6">
                  <OrderHistory />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
