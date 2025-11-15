import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

async function verifyOwnership(supabase: Awaited<ReturnType<typeof createServerClient>>, menuItemId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // ID is UUID (string), no conversion needed
  const { data: menuItem, error } = await supabase
    .from("menu_items")
    .select("restaurant_id")
    .eq("id", menuItemId)
    .single();
  if (error || !menuItem) {
    console.error("Error verifying ownership:", error);
    return false;
  }

  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!restaurant) {
    console.error("Restaurant not found for user");
    return false;
  }

  return menuItem.restaurant_id === restaurant.id;
}


// GET one menu item (no auth needed for public viewing, but can be added if required)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Menu item ID is required" }, { status: 400 });
    }

    // ID is UUID (string), no conversion needed
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("GET menu item error:", error);
      return NextResponse.json({ error: "Menu item not found." }, { status: 404 });
    }

    if (!data) {
      return NextResponse.json({ error: "Menu item not found." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET menu item unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the menu item." },
      { status: 500 }
    );
  }
}

// UPDATE one menu item
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Menu item ID is required" }, { status: 400 });
    }
    
    // Authorization check
    const isOwner = await verifyOwnership(supabase, id);
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ID is UUID (string), no conversion needed
    console.log("PUT request received for menu item ID:", id);
    let body;
    try {
      body = await req.json();
      console.log("PUT request body:", body);
    } catch (parseError) {
      console.error("PUT request body parse error:", parseError);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    // Validate required fields only if they're being updated
    // For partial updates (like setting available: false), we don't need name/price
    // Only validate if name or price are explicitly provided in the request
    if (body.name !== undefined && !body.name) {
      console.log("Validation failed: Name cannot be empty");
      return NextResponse.json(
        { error: "Name cannot be empty if provided" },
        { status: 400 }
      );
    }
    if (body.price !== undefined && (body.price === null || body.price < 0)) {
      console.log("Validation failed: Price must be valid");
      return NextResponse.json(
        { error: "Price must be a valid positive number if provided" },
        { status: 400 }
      );
    }

    // Build update object - only include fields that are provided
    const updateData: {
      updated_at: string;
      name?: string;
      description?: string | null;
      price?: number;
      category?: string | null;
      available?: boolean;
      photo_url?: string | null;
    } = {
      updated_at: new Date().toISOString(),
    };
    
    // Only update fields that are explicitly provided
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description || null;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.category !== undefined) updateData.category = body.category || null;
    if (body.available !== undefined) updateData.available = body.available;
    if (body.photo_url !== undefined) updateData.photo_url = body.photo_url || null;

    console.log("Update data to be sent:", updateData);

    // Convert ID to number if it's numeric, otherwise use as-is (for UUIDs)
    const menuItemId = isNaN(Number(id)) ? id : Number(id);
    console.log("Updating menu item with ID:", id, "Type:", typeof id, "Converted to:", menuItemId, "Type:", typeof menuItemId);
    const { data, error } = await supabase
      .from("menu_items")
      .update(updateData)
      .eq("id", menuItemId)
      .select()
      .single();

    if (error) {
      console.error("❌ PUT menu item Supabase error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      console.error("Error details:", JSON.stringify(error, null, 2));
      console.error("Update query was:", { id, menuItemId, updateData });
      
      // Return more detailed error message
      let errorMessage = error.message || "Failed to update menu item";
      if (error.code) {
        errorMessage = `${errorMessage} (Code: ${error.code})`;
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        code: error.code,
        details: error.details || null
      }, { status: 400 });
    }

    console.log("PUT successful, updated data:", data);

    if (!data) {
      return NextResponse.json({ error: "Menu item not found or update failed" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("PUT menu item unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while updating the menu item." },
      { status: 500 }
    );
  }
}

// DELETE one menu item
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("=== DELETE MENU ITEM START ===");
    const supabase = await createServerClient();
    const { id } = await params;
    console.log("Menu item ID received:", id, "Type:", typeof id);

    if (!id) {
      console.log("ERROR: No ID provided");
      return NextResponse.json({ error: "Menu item ID is required" }, { status: 400 });
    }

    // Authorization check - verify ownership first
    console.log("Checking ownership...");
    const isOwner = await verifyOwnership(supabase, id);
    console.log("Ownership check result:", isOwner);
    if (!isOwner) {
      console.log("ERROR: Unauthorized - user doesn't own this menu item");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get restaurant ID for the database function
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("ERROR: No user found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("User ID:", user.id);

    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (restaurantError) {
      console.error("Restaurant fetch error:", restaurantError);
    }
    console.log("Restaurant ID:", restaurant?.id);

    if (!restaurant) {
      console.log("ERROR: Restaurant not found");
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }

    // First, verify the menu item exists and get its ID type
    console.log("Fetching menu item from database...");
    const { data: menuItemData, error: menuItemError } = await supabase
      .from("menu_items")
      .select("id, restaurant_id")
      .eq("id", id)
      .single();

    if (menuItemError) {
      console.error("Menu item fetch error:", menuItemError);
      console.error("Error details:", JSON.stringify(menuItemError, null, 2));
    }
    console.log("Menu item data:", menuItemData);
    console.log("Menu item ID from DB:", menuItemData?.id, "Type:", typeof menuItemData?.id);

    if (menuItemError || !menuItemData) {
      console.log("ERROR: Menu item not found in database");
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    // Check if menu item is used in any orders before deletion
    // The menu_item column in order_items references menu_items.id
    // Try checking with the actual ID from the database
    console.log("Checking order_items table for menu_item:", menuItemData.id);
    console.log("Menu item ID type from DB:", typeof menuItemData.id);
    
    // Try multiple formats to ensure we catch all cases
    const checks = [
      { name: "DB ID as-is", value: menuItemData.id },
      { name: "DB ID as string", value: String(menuItemData.id) },
      { name: "DB ID as number", value: Number(menuItemData.id) },
      { name: "Original ID", value: id },
      { name: "Original ID as number", value: Number(id) },
    ];

    interface OrderItem {
      id: string;
      order_id: string;
      menu_item: string | number;
    }
    const allOrderItems: OrderItem[] = [];
    
    for (const check of checks) {
      if (check.value === null || check.value === undefined) continue;
      
      console.log(`Checking with ${check.name}:`, check.value, "Type:", typeof check.value);
      const { data, error } = await supabase
        .from("order_items")
        .select("id, order_id, menu_item")
        .eq("menu_item", check.value)
        .limit(5);
      
      if (error) {
        console.error(`Error checking with ${check.name}:`, error);
      } else if (data && data.length > 0) {
        console.log(`✅ Found ${data.length} order items with ${check.name}`);
        allOrderItems.push(...data);
      } else {
        console.log(`❌ No order items found with ${check.name}`);
      }
    }

    // Remove duplicates based on order_items.id
    const uniqueOrderItems = Array.from(
      new Map(allOrderItems.map(item => [item.id, item])).values()
    );
    
    console.log("Total unique order items found:", uniqueOrderItems.length);
    console.log("Order items details:", uniqueOrderItems);

    const foundInOrders = uniqueOrderItems.length > 0;

    console.log("Found in orders check result:", {
      uniqueOrderItemsCount: uniqueOrderItems.length,
      foundInOrders
    });

    if (foundInOrders) {
      console.log("⚠️ BLOCKING DELETION: Menu item found in orders, preventing deletion");
      console.log("Order items details:", uniqueOrderItems);
      
      // Get order details for better debugging
      const orderIds = uniqueOrderItems.map(item => item.order_id);
      const { data: orders } = await supabase
        .from("orders")
        .select("id, track_code, status, created_at")
        .in("id", orderIds)
        .limit(10);
      
      if (orders) {
        console.log("Orders using this menu item:", orders);
      }
      
      return NextResponse.json({ 
        error: "Cannot delete this menu item because it is used in existing orders. You can mark it as unavailable instead.",
        debug: {
          orderItemsCount: uniqueOrderItems.length,
          orderItems: uniqueOrderItems.map(item => ({
            id: item.id,
            order_id: item.order_id,
            menu_item: item.menu_item
          })),
          orders: orders || []
        }
      }, { status: 409 });
    }

    console.log("✅ No order items found - proceeding with deletion");

    // Try using the Supabase database function first
    console.log("Attempting to use database RPC function...");
    console.log("RPC parameters:", { item_uuid: id, restaurant_uuid: restaurant.id });
    let functionResult = null;
    let functionError = null;
    
    try {
      const result = await supabase.rpc('delete_menu_item', {
        item_uuid: id,
        restaurant_uuid: restaurant.id
      });
      
      console.log("RPC result:", result);
      
      // Supabase RPC returns { data, error } structure
      if (result.error) {
        functionError = result.error;
        console.error("RPC function error:", functionError);
        console.error("RPC error details:", JSON.stringify(functionError, null, 2));
      } else {
        functionResult = result.data;
        console.log("RPC function success:", functionResult);
      }
    } catch (rpcError) {
      console.warn("RPC function exception caught:", rpcError);
      console.warn("RPC exception details:", JSON.stringify(rpcError, null, 2));
      // If RPC fails, we'll fall back to direct delete
    }

    // If RPC worked, return success
    if (functionResult && typeof functionResult === 'object' && 'success' in functionResult && functionResult.success) {
      console.log("✅ SUCCESS: RPC function deleted menu item");
      console.log("=== DELETE MENU ITEM END (RPC SUCCESS) ===");
      return NextResponse.json({ 
        success: true, 
        message: functionResult.message || "Menu item deleted successfully" 
      });
    }

    // If RPC failed with foreign key error, return appropriate message
    if (functionError) {
      const errorMessage = functionError.message || String(functionError);
      console.error("❌ RPC function error:", functionError);
      console.error("Error message:", errorMessage);
      
      // Check if it's a foreign key constraint error
      const isForeignKeyError = 
        errorMessage.includes("foreign key constraint") || 
        errorMessage.includes("fkey") ||
        errorMessage.includes("violates foreign key") ||
        errorMessage.includes("order_items_menu_item_fkey") ||
        errorMessage.includes("violates foreign key constraint");
      
      console.log("Is foreign key error?", isForeignKeyError);
      
      if (isForeignKeyError) {
        console.log("⚠️ BLOCKING DELETION: Foreign key constraint detected from RPC");
        console.log("=== DELETE MENU ITEM END (FK ERROR FROM RPC) ===");
        return NextResponse.json({ 
          error: "Cannot delete this menu item because it is used in existing orders. You can mark it as unavailable instead." 
        }, { status: 409 });
      }
    }

    // Fallback to direct delete if RPC didn't work or didn't return success
    console.log("🔄 Using direct delete as fallback");
    console.log("Delete parameters:", { id, restaurant_id: restaurant.id });
    const { data: deleteData, error: deleteError } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)
      .eq("restaurant_id", restaurant.id) // Extra safety check
      .select();

    if (deleteError) {
      console.error("❌ Direct delete error:", deleteError);
      console.error("Delete error details:", JSON.stringify(deleteError, null, 2));
      const errorMessage = deleteError.message || String(deleteError);
      console.error("Error message:", errorMessage);
      
      // Check if it's a foreign key constraint error
      const isForeignKeyError = 
        errorMessage.includes("foreign key constraint") || 
        errorMessage.includes("fkey") ||
        errorMessage.includes("violates foreign key") ||
        errorMessage.includes("order_items_menu_item_fkey") ||
        errorMessage.includes("violates foreign key constraint");
      
      console.log("Is foreign key error?", isForeignKeyError);
      
      if (isForeignKeyError) {
        console.log("⚠️ BLOCKING DELETION: Foreign key constraint detected from direct delete");
        console.log("=== DELETE MENU ITEM END (FK ERROR FROM DIRECT DELETE) ===");
        return NextResponse.json({ 
          error: "Cannot delete this menu item because it is used in existing orders. You can mark it as unavailable instead." 
        }, { status: 409 });
      }
      
      console.log("=== DELETE MENU ITEM END (DELETE ERROR) ===");
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Verify deletion happened
    if (!deleteData || deleteData.length === 0) {
      console.log("⚠️ WARNING: Delete query succeeded but no data returned");
      console.log("=== DELETE MENU ITEM END (NO DATA RETURNED) ===");
      return NextResponse.json({ error: "Menu item not found or already deleted" }, { status: 404 });
    }

    console.log("✅ SUCCESS: Menu item deleted directly");
    console.log("Deleted data:", deleteData);
    console.log("=== DELETE MENU ITEM END (SUCCESS) ===");
    return NextResponse.json({ success: true, deleted: deleteData });
  } catch (err) {
    console.error("❌ CRITICAL ERROR in DELETE menu item catch block:", err);
    console.error("Error type:", err?.constructor?.name);
    console.error("Error stack:", err instanceof Error ? err.stack : 'No stack trace');
    console.error("Error details:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Error message:", errorMessage);
    
    // Check if it's a foreign key constraint error in the catch block too
    const isForeignKeyError = 
      errorMessage.includes("foreign key constraint") || 
      errorMessage.includes("fkey") ||
      errorMessage.includes("violates foreign key") ||
      errorMessage.includes("order_items_menu_item_fkey") ||
      errorMessage.includes("violates foreign key constraint");
    
    console.log("Is foreign key error in catch?", isForeignKeyError);
    
    if (isForeignKeyError) {
      console.log("⚠️ BLOCKING DELETION: Foreign key constraint detected in catch block");
      console.log("=== DELETE MENU ITEM END (FK ERROR IN CATCH) ===");
      return NextResponse.json({ 
        error: "Cannot delete this menu item because it is used in existing orders. You can mark it as unavailable instead." 
      }, { status: 409 });
    }
    
    console.log("=== DELETE MENU ITEM END (UNEXPECTED ERROR) ===");
    return NextResponse.json(
      { error: "An unexpected error occurred while deleting the menu item." },
      { status: 500 }
    );
  }
}