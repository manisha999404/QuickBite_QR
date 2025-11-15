'use client';

import React from 'react';
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Clock, ChefHat, CheckCircle, XCircle, Utensils, Package, CreditCard, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { OrderItem, OrderItemStatus } from '@/app/dashboard/orders/LiveOrders';
import { setOrderStatus } from '@/lib/api/orders';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface LiveOrdersComponentProps {
  fetchLiveOrders: () => Promise<void>;
  refreshing: boolean;
  liveOrders: OrderItem[] | null;
  filteredOrders: OrderItem[] | null;
  activeStatus: OrderItemStatus | 'All';
  setActiveStatus: (status: OrderItemStatus | 'All') => void;
  formatDate: (dateString: string) => string;
  getTotalPrice: (orders: OrderItem[] | null) => number;
  errorMsg?: string | null;
}

const ETA_PRESETS = [10, 15, 20, 25, 30];

const LiveOrdersComponent: React.FC<LiveOrdersComponentProps> = ({
  fetchLiveOrders,
  refreshing,
  liveOrders,
  filteredOrders,
  activeStatus,
  setActiveStatus,
  formatDate,
  getTotalPrice,
  errorMsg,
}) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [etaChoice, setEtaChoice] = useState<Record<string, number>>({});
  const processingOrdersRef = useRef<Set<string>>(new Set()); // Track orders being processed

  const handleUpdate = async (orderId: string, status: OrderItemStatus, eta?: number | null) => {
    // Prevent multiple clicks on the same order
    if (processingOrdersRef.current.has(orderId)) {
      return;
    }

    // Mark order as processing immediately
    processingOrdersRef.current.add(orderId);
    setUpdatingId(orderId);

    try {
      await setOrderStatus(orderId, status, eta ?? null);
      // Clear updating state immediately so button becomes enabled
      setUpdatingId(null);
      processingOrdersRef.current.delete(orderId);
      
      // Then refresh the order data
      await fetchLiveOrders();
    } catch (e: unknown) {
      console.error('[update status]', e);
      const errorMessage = e instanceof Error ? e.message : 'Failed to update status';
      alert(errorMessage);
      // Clear state on error too
      setUpdatingId(null);
      processingOrdersRef.current.delete(orderId);
    }
  };

  const getStatusIcon = (status: OrderItemStatus | null) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'Preparing': return <ChefHat className="h-4 w-4" />;
      case 'Serve': return <CheckCircle className="h-4 w-4" />;
      case 'Cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: OrderItemStatus | null) => {
    switch (status) {
      case 'Cancelled': return 'destructive';
      case 'Confirmed':
      case 'Preparing':
      case 'Serve': return 'default';
      case 'Pending':
      default: return 'secondary';
    }
  };

  return (
    <div className="w-full">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Live Orders
              <span className="text-2xl text-green-500 font-light mx-2">•</span>
              <span className="text-gray-500 font-medium text-sm">
                Real-time Updates
              </span>
            </h1>
          </div>
          <p className="text-sm text-gray-600 ml-11">
            Manage and track all incoming orders in real-time
          </p>
        </div>
        <Button 
          onClick={fetchLiveOrders} 
          disabled={refreshing} 
          variant="outline" 
          size="sm"
          className="w-full sm:w-auto flex items-center gap-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {errorMsg && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm opacity-90">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="group bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gray-50">
                <Package className="h-4 w-4 text-gray-600" />
              </div>
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">
              {liveOrders?.length || 0}
            </div>
            <p className="text-sm text-gray-500 mt-2">All time orders</p>
          </CardContent>
        </Card>
        
        <Card className="group bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-yellow-50">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {liveOrders?.filter(o => o.status === 'Pending').length || 0}
            </div>
            <p className="text-sm text-gray-500 mt-2">Awaiting confirmation</p>
          </CardContent>
        </Card>
        
        <Card className="group bg-white border border-gray-200 hover:shadow-md transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-green-50">
                <CreditCard className="h-4 w-4 text-green-600" />
              </div>
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ₹{getTotalPrice(liveOrders).toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-2">Total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeStatus} onValueChange={(v)=>setActiveStatus(v as OrderItemStatus|'All')} className="w-full">
        <TabsList className="w-full flex overflow-x-auto pb-1 mb-8 sm:mb-10 bg-gray-100 p-1.5 rounded-lg border border-gray-200 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TabsTrigger value="All" className="flex-1 min-w-[60px] sm:min-w-[80px] data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:font-semibold font-medium transition-all duration-300 rounded-md text-sm border border-transparent data-[state=active]:border-gray-200 h-9">
            <span className="truncate">All</span>
          </TabsTrigger>
          <TabsTrigger value="Pending" className="flex-1 min-w-[80px] sm:min-w-[100px] data-[state=active]:bg-yellow-50 data-[state=active]:text-yellow-700 data-[state=active]:border-yellow-200 font-medium transition-all duration-300 rounded-md text-sm border border-transparent h-9">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="truncate">Pending</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="Confirmed" className="flex-1 min-w-[90px] sm:min-w-[110px] data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 font-medium transition-all duration-300 rounded-md text-sm border border-transparent h-9">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="truncate">Confirmed</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="Preparing" className="flex-1 min-w-[100px] sm:min-w-[120px] data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200 font-medium transition-all duration-300 rounded-md text-sm border border-transparent h-9">
            <span className="flex items-center gap-1">
              <ChefHat className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="truncate">Preparing</span>
            </span>
          </TabsTrigger>
          <TabsTrigger value="Serve" className="flex-1 min-w-[70px] sm:min-w-[90px] data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 data-[state=active]:shadow-md font-medium transition-all duration-300 rounded-lg text-[13px] sm:text-[14px] border border-transparent data-[state=active]:border-emerald-100 h-9 font-sans">
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              <span className="truncate">Serve</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <div>
          {filteredOrders && filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isUpdating = updatingId === order.order.id;
                const eta = etaChoice[order.order.id] ?? 15;
                return (
                  <Card key={order.id} className="group overflow-hidden border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 relative">
                    <div className={cn(
                      "absolute top-0 left-0 h-2 w-full rounded-t-lg",
                      order.status === 'Pending' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                      order.status === 'Confirmed' ? 'bg-gradient-to-r from-slate-400 to-slate-500' :
                      order.status === 'Preparing' ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                      order.status === 'Serve' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                    )} />
                    
                    <CardHeader className="pb-3 sm:pb-4 relative z-10">
                      <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Order ID and Status Row */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="font-mono text-xs bg-gray-100 border-gray-300 text-gray-700">
                              #{order.order.id.slice(-6)}
                            </Badge>
                            <Link
                              href={`/restaurant/${order.order.restaurant.name.toLowerCase().replace(/\s+/g, '-')}/orders/${order.order.track_code}`}
                              className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
                              target="_blank"
                            >
                              <span className="hidden sm:inline">Order</span> #{order.order.track_code}
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </Link>
                            {order.order.table_number && (
                              <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                                <span className="hidden sm:inline">Table </span>#{order.order.table_number}
                              </Badge>
                            )}
                          </div>
                          <Badge 
                            variant={getStatusVariant(order.status)} 
                            className={cn(
                              "px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold flex-shrink-0 rounded-full shadow-sm hover:shadow-md transition-all duration-300 w-fit",
                              order.status === 'Pending' && 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-200',
                              order.status === 'Confirmed' && 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border border-slate-200',
                              order.status === 'Preparing' && 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200',
                              order.status === 'Serve' && 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-200',
                              order.status === 'Cancelled' && 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200',
                              "group-hover:scale-105"
                            )}
                          >
                            <span className="flex items-center gap-1.5 sm:gap-2">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </Badge>
                        </div>
                        
                        {/* Restaurant and Payment Info Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Utensils className="h-3.5 w-3.5" />
                            {order.order.restaurant.name}
                          </span>
                          <span className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="font-mono text-xs">{formatDate(order.created_at)}</span>
                          <span className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold w-fit bg-blue-100 text-blue-800 border border-blue-200">
                            Pay on Table
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <Separator className="my-2" />
                    
                    <CardContent className="pt-4 sm:pt-6 pb-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-50">
                              <Utensils className="h-4 w-4 text-gray-600" />
                            </div>
                            <h3 className="font-bold text-lg sm:text-xl text-gray-900">
                              {order.menu_item?.name}
                            </h3>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                            <span className="flex items-center gap-2 font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full w-fit">
                              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                              Qty: {order.quantity}
                            </span>
                            <span className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="font-mono text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full w-fit">
                              ₹{order.price.toFixed(2)} each
                            </span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200">
                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                              ₹{(order.price * order.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1 font-medium">Total amount</p>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Order Actions */}
                      <div className="mt-4 sm:mt-6 pt-4 border-t border-gradient-to-r from-transparent via-border to-transparent">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                          {/* Confirm Order Button - Only show for Pending status */}
                          {order.status === 'Pending' && (
                            <Button
                              size="sm"
                              variant="default"
                              className="relative h-10 sm:h-9 text-xs font-semibold transition-all duration-300 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white border-0"
                              disabled={isUpdating || processingOrdersRef.current.has(order.order.id)}
                              onClick={() => handleUpdate(order.order.id, 'Confirmed')}
                            >
                              {isUpdating && order.status === 'Pending' ? (
                                <div className="relative z-10 flex items-center gap-2">
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Updating...
                                </div>
                              ) : (
                                <div className="relative z-10 flex items-center gap-1.5">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Confirm Order</span>
                                  <span className="sm:hidden">Confirm</span>
                                </div>
                              )}
                            </Button>
                          )}

                          {/* Start Preparing Button - Only show for Confirmed status */}
                          {order.status === 'Confirmed' && (
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
                              <select
                                className="h-10 sm:h-9 rounded-lg border-2 border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-900 shadow-sm transition-all duration-300 flex-1 sm:flex-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 hover:border-gray-400 hover:shadow-md"
                                value={eta}
                                onChange={(e) => setEtaChoice((prev) => ({ ...prev, [order.order.id]: Number(e.target.value) }))}
                                disabled={isUpdating || processingOrdersRef.current.has(order.order.id)}
                              >
                                {ETA_PRESETS.map((m) => (
                                  <option key={m} value={m} className="text-sm">
                                    {m} min{m > 1 ? 's' : ''}
                                  </option>
                                ))}
                              </select>
                              <Button
                                size="sm"
                                variant="default"
                                className="relative h-10 sm:h-9 text-xs font-semibold transition-all duration-300 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 font-bold"
                                disabled={isUpdating || processingOrdersRef.current.has(order.order.id)}
                                onClick={() => handleUpdate(order.order.id, 'Preparing', eta)}
                              >
                                {isUpdating && order.status === 'Confirmed' ? (
                                  <div className="relative z-10 flex items-center gap-2">
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Updating...
                                  </div>
                                ) : (
                                  <div className="relative z-10 flex items-center gap-1.5">
                                    <ChefHat className="h-3.5 w-3.5" />
                                    <span className="hidden sm:inline">Start Preparing ({eta}m)</span>
                                    <span className="sm:hidden">Preparing ({eta}m)</span>
                                  </div>
                                )}
                              </Button>
                            </div>
                          )}

                          {/* Mark as Serve Button - Only show for Preparing status */}
                          {order.status === 'Preparing' && (
                            <Button
                              size="sm"
                              variant="default"
                              className="relative h-10 sm:h-9 text-xs font-semibold transition-all duration-300 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white border-0"
                              disabled={isUpdating || processingOrdersRef.current.has(order.order.id)}
                              onClick={() => handleUpdate(order.order.id, 'Serve')}
                            >
                              {isUpdating ? (
                                <div className="relative z-10 flex items-center gap-2">
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Updating...
                                </div>
                              ) : (
                                <div className="relative z-10 flex items-center gap-1.5">
                                  <Package className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline">Mark as Serve</span>
                                  <span className="sm:hidden">Serve</span>
                                </div>
                              )}
                            </Button>
                          )}

                          {/* Cancel Button - Show for Pending, Confirmed, and Preparing (not for Serve or Cancelled) */}
                          {order.status !== 'Serve' && order.status !== 'Cancelled' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-10 sm:h-9 text-xs font-semibold bg-rose-50 hover:bg-rose-100 border-rose-200 hover:border-rose-300 text-rose-700 transition-all duration-300 rounded-lg shadow-sm hover:shadow-md flex-1 sm:flex-none sm:ml-auto disabled:opacity-100 disabled:bg-rose-700 disabled:text-white disabled:border-rose-700"
                              disabled={isUpdating || processingOrdersRef.current.has(order.order.id)}
                              onClick={() => {
                                if (confirm('Are you sure you want to cancel this order?')) {
                                  handleUpdate(order.order.id, 'Cancelled');
                                }
                              }}
                            >
                              <div className="flex items-center gap-1.5">
                                <XCircle className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Cancel Order</span>
                                <span className="sm:hidden">Cancel</span>
                              </div>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 py-4 px-6 border-t border-gray-200">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <p className="text-xs text-gray-600 font-medium">
                              Last updated: {new Date().toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 font-semibold">Live</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-500 font-medium">#{order.order.id.slice(-4)}</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-300 p-12 bg-gray-50">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Clock className="h-12 w-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">No orders found</h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg leading-relaxed">
                {activeStatus === 'All'
                  ? "You don't have any active orders at the moment. New orders will appear here in real-time."
                  : `You don't have any orders with status "${activeStatus}".`}
              </p>
              {activeStatus !== 'All' && (
                <Button 
                  variant="outline" 
                  className="mt-6 bg-white border-gray-300 hover:bg-gray-50"
                  onClick={() => setActiveStatus('All')}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    View All Orders
                  </div>
                </Button>
              )}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default LiveOrdersComponent;