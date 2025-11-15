'use client';

import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { MapPin, Calendar, DollarSign } from 'lucide-react';
import { OrderWithItems } from '@/lib/api/orderItems';

interface OrderItemManagerProps {
  order: OrderWithItems;
  onOrderUpdate: () => void;
}

const OrderItemManager: React.FC<OrderItemManagerProps> = ({ order }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColorClass = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-amber-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-purple-500';
      case 'ready': return 'bg-green-500';
      case 'served': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const orderStatus = order.order.status || 'pending';
  const statusColorClass = getStatusColorClass(orderStatus);

  return (
    <Card className="w-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
      {/* Status Accent Bar */}
      <div className={`h-1.5 w-full ${statusColorClass}`} />
      
      <CardHeader className="pb-4 bg-gradient-to-br from-white to-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Order Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                Order #{order.order.track_code}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {order.order.table?.table_number && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>Table {order.order.table.table_number}</span>
                </div>
              )}
              {order.order.created_at && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(order.order.created_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-lg border-2 border-gray-200">
            <DollarSign className="h-5 w-5 text-gray-600" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Total</div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{order.order.total_amount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default OrderItemManager;
