'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, History, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface OrderStats {
  activeOrders: number;
  completedOrders: number;
  todayRevenue: number;
  todayOrders: number;
}

const OrderStatsCards: React.FC = () => {
  const [stats, setStats] = useState<OrderStats>({
    activeOrders: 0,
    completedOrders: 0,
    todayRevenue: 0,
    todayOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        setLoading(false);
        return;
      }

      // Get restaurant
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (restaurantError || !restaurant) {
        console.error('Restaurant not found:', restaurantError);
        setLoading(false);
        return;
      }

      // Get all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .eq('restaurant_id', restaurant.id);

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        setLoading(false);
        return;
      }

      // Calculate statistics
      const activeStatuses = ['pending', 'confirmed', 'preparing', 'ready'];
      const activeOrders = orders?.filter(order => 
        activeStatuses.includes(order.status || '')
      ).length || 0;

      const completedOrders = orders?.filter(order => 
        order.status === 'complete' || order.status === 'served'
      ).length || 0;

      // Today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= today;
      }) || [];

      const todayOrdersCount = todayOrders.length;
      const todayRevenue = todayOrders.reduce((sum, order) => 
        sum + (Number(order.total_amount) || 0), 0
      );

      setStats({
        activeOrders,
        completedOrders,
        todayRevenue,
        todayOrders: todayOrdersCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      {/* Live Orders Card */}
      <Card 
        className="group bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        onClick={() => {
          const liveOrdersSection = document.getElementById('live-orders-section');
          liveOrdersSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                Live Orders
              </p>
              {loading ? (
                <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.activeOrders}</p>
              )}
              <p className="text-xs text-gray-500 font-medium">Real-time monitoring</p>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50">
              <Clock className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order History Card */}
      <Card 
        className="group bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        onClick={() => {
          const orderHistorySection = document.getElementById('order-history-section');
          orderHistorySection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                Order History
              </p>
              {loading ? (
                <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats.completedOrders}</p>
              )}
              <p className="text-xs text-gray-500 font-medium">Historical data</p>
            </div>
            <div className="p-4 rounded-2xl bg-green-50">
              <History className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Card */}
      <Card 
        className="group bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        onClick={() => {
          window.location.href = '/dashboard/analytics';
        }}
      >
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                Performance
              </p>
              {loading ? (
                <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.todayRevenue)}</p>
                  <p className="text-sm text-gray-600">{stats.todayOrders} orders today</p>
                </div>
              )}
              <p className="text-xs text-gray-500 font-medium">Live analytics</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50">
              <TrendingUp className="h-7 w-7 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStatsCards;

