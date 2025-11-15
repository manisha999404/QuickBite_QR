'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Clock, Activity } from 'lucide-react';
import OrdersChart, { RevenueChart } from '@/components/charts/OrdersChart';
import { supabase } from '@/lib/supabase/client';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    todayRevenue: 0,
    todayOrders: 0,
    ordersByStatus: {} as Record<string, number>,
    ordersChartData: [] as { name: string; orders: number }[],
    revenueChartData: [] as { name: string; revenue: number }[],
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Not authenticated');
      }

      // Get restaurant
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (restaurantError || !restaurant) {
        throw new Error('Restaurant not found');
      }

      // Get all orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status, total_amount, created_at')
        .eq('restaurant_id', restaurant.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      // Calculate analytics
      const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;
      const totalOrders = orders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Today's stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrdersArray = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= today;
      }) || [];
      const todayOrders = todayOrdersArray.length;
      const todayRevenue = todayOrdersArray.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);

      // Orders by status
      const ordersByStatus: Record<string, number> = {};
      orders?.forEach(order => {
        const status = order.status || 'unknown';
        ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
      });

      // Last 7 days data for charts
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        date.setHours(0, 0, 0, 0);
        return date;
      });

      const ordersChartData = last7Days.map(date => {
        const dayOrders = orders?.filter(order => {
          const orderDate = new Date(order.created_at);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === date.getTime();
        }) || [];
        return {
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          orders: dayOrders.length,
        };
      });

      const revenueChartData = last7Days.map(date => {
        const dayOrders = orders?.filter(order => {
          const orderDate = new Date(order.created_at);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === date.getTime();
        }) || [];
        const revenue = dayOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
        return {
          name: date.toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: revenue,
        };
      });

      setAnalytics({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        todayRevenue,
        todayOrders,
        ordersByStatus,
        ordersChartData,
        revenueChartData,
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Hero / Banner Section */}
      <div className="relative overflow-hidden rounded-xl mb-4 lg:mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/60 to-indigo-900/40 z-10"></div>
        <div className="relative z-20 p-4 sm:p-6 lg:p-10 text-white">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-base sm:text-lg opacity-80">
            Insights and performance metrics for your restaurant
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-12">
        <div className="max-w-[2000px] mx-auto space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-900 mt-2">
                        ₹{analytics.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-500 rounded-lg">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-900 mt-2">
                        {analytics.totalOrders}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-500 rounded-lg">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">Avg Order Value</p>
                      <p className="text-2xl font-bold text-purple-900 mt-2">
                        ₹{analytics.averageOrderValue.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">Today&apos;s Revenue</p>
                      <p className="text-2xl font-bold text-orange-900 mt-2">
                        ₹{analytics.todayRevenue.toFixed(2)}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        {analytics.todayOrders} orders
                      </p>
                    </div>
                    <div className="p-3 bg-orange-500 rounded-lg">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Orders Over Time (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OrdersChart data={analytics.ordersChartData} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Revenue Over Time (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueChart data={analytics.revenueChartData} />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Status Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Orders by Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                    <div
                      key={status}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center"
                    >
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600 capitalize mt-1">{status}</p>
                    </div>
                  ))}
                  {Object.keys(analytics.ordersByStatus).length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      No order status data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

