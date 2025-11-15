'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Clock, CheckCircle, Package, AlertTriangle, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { OrderWithItems, getRestaurantOrders } from '@/lib/api/orderItems';
import OrderItemManager from './OrderItemManager';

type OrderStatus = 'all' | 'pending' | 'confirmed';

const ITEMS_PER_PAGE = 10;

const EnhancedLiveOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null>(null);

  const fetchOrders = useCallback(async (page: number = currentPage) => {
    setRefreshing(true);
    setError(null);
    
    try {
      console.log('[EnhancedLiveOrders] Fetching orders for page:', page);
      const result = await getRestaurantOrders(page, ITEMS_PER_PAGE);
      console.log('[EnhancedLiveOrders] Fetch result:', result);
      
      if (result.success && result.data) {
        // Log the raw data to see what we're getting
        console.log('[EnhancedLiveOrders] Raw data received:', result.data);
        console.log('[EnhancedLiveOrders] Number of orders in response:', result.data.length);
        
        // Filter out only truly invalid orders (missing required fields)
        // Allow orders with empty items array
        const validOrders = result.data.filter((order) => {
          if (!order || !order.order) {
            console.warn('[EnhancedLiveOrders] Invalid order structure:', order);
            return false;
          }
          // Ensure items is an array (even if empty)
          if (!Array.isArray(order.items)) {
            console.warn('[EnhancedLiveOrders] Order items is not an array:', order.order.id);
            // Set items to empty array if missing
            order.items = [];
          }
          return true;
        });
        
        console.log('[EnhancedLiveOrders] Valid orders after filtering:', validOrders.length);
        console.log('[EnhancedLiveOrders] Sample order:', validOrders[0]);
        setOrders(validOrders);
        
        // Update pagination metadata
        if (result.pagination) {
          setPagination(result.pagination);
          setCurrentPage(result.pagination.page);
        }
      } else {
        console.error('[EnhancedLiveOrders] Fetch failed:', result.error);
        setError(result.error || 'Failed to fetch orders');
        setOrders([]);
      }
    } catch (err) {
      console.error('[EnhancedLiveOrders] Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, fetchOrders]);

  // Reset to page 1 when status filter changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchOrders(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStatus]);

  const filteredOrders = orders.filter(order => {
    if (!order || !order.order) return false;
    if (activeStatus === 'all') return true;
    // Add safety check for order structure
    return order.order.status === activeStatus;
  });

  const getStatusCounts = () => {
    return orders.reduce((acc, order) => {
      // Add safety check for order structure
      if (order && order.order && order.order.status) {
        const status = order.order.status;
        acc[status] = (acc[status] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <RefreshCw className="h-10 w-10 animate-spin mx-auto text-blue-600" />
          <div>
            <p className="text-lg font-semibold text-gray-900">Loading orders...</p>
            <p className="text-sm text-gray-600 mt-1">Please wait while we fetch your orders</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md mx-auto">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Orders</h3>
        <p className="text-red-600 mb-6">{error}</p>
        <Button 
          onClick={() => fetchOrders(currentPage)} 
          variant="outline" 
          className="border-red-300 text-red-700 hover:bg-red-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Live Orders</h1>
          <p className="text-gray-600 text-sm sm:text-base">Monitor and manage orders in real-time</p>
        </div>
        <Button 
          onClick={() => fetchOrders(currentPage)} 
          disabled={refreshing}
          variant="outline"
          className="border-gray-300 hover:bg-gray-50 transition-colors"
          size="lg"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{pagination?.total || orders.length}</div>
            <div className="text-sm font-medium text-gray-600">Total Orders</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{statusCounts.pending || 0}</div>
            <div className="text-sm font-medium text-gray-600">Pending</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{statusCounts.confirmed || 0}</div>
            <div className="text-sm font-medium text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter Tabs */}
      <Tabs value={activeStatus} onValueChange={(value) => setActiveStatus(value as OrderStatus)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="all" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">All</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-gray-200 rounded-full">{orders.length}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Pending</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
              {statusCounts.pending || 0}
            </span>
          </TabsTrigger>
          <TabsTrigger 
            value="confirmed" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Confirmed</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
              {statusCounts.confirmed || 0}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderItemManager
                key={order.order.id}
                order={order}
                onOrderUpdate={() => fetchOrders(currentPage)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{' '}
                <span className="font-semibold">{pagination.total}</span> orders
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPreviousPage || loading}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!pagination.hasNextPage || loading}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default EnhancedLiveOrders;
