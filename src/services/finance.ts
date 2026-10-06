import { FeeBreakdown } from '@/types';

export const PLATFORM_DELIVERY_FEE_CENTS = 200; // R2.00 paid by buyer
export const PLATFORM_DEVELOPER_FEE_CENTS = 50;  // R0.50 charged to seller per completed order

/**
 * Formats integer cents into South African Rand string (e.g. 3500 -> "R35.00")
 */
export function formatZAR(cents: number): string {
  const rands = (cents / 100).toFixed(2);
  return `R${rands}`;
}

/**
 * Centralized Financial Calculation Engine for CampusCart Orders.
 *
 * Rules:
 * 1. Subtotal = sum of (item.unitPrice * quantity)
 * 2. Delivery Fee = R2.00 (200 cents), paid by the buyer.
 * 3. Total Buyer Payment = Subtotal + Delivery Fee (R2.00).
 * 4. Developer/Platform Fee = R0.50 (50 cents), charged to the seller on completed orders.
 * 5. Seller Net Earnings = Subtotal + Delivery Fee - Platform Fee = Subtotal + R1.50.
 *
 * IMPORTANT: The R0.50 platform fee is NEVER added to the buyer's checkout price.
 */
export function calculateOrderFees(subtotalCents: number): FeeBreakdown {
  const safeSubtotal = Math.max(0, Math.round(subtotalCents));

  if (safeSubtotal === 0) {
    return {
      subtotalCents: 0,
      deliveryFeeCents: 0,
      totalCents: 0,
      platformFeeCents: 0,
      sellerNetEarningsCents: 0,
    };
  }

  const deliveryFeeCents = PLATFORM_DELIVERY_FEE_CENTS;
  const totalCents = safeSubtotal + deliveryFeeCents;
  const platformFeeCents = PLATFORM_DEVELOPER_FEE_CENTS;
  // Seller delivers themselves, so they collect the delivery fee but pay R0.50 platform fee
  const sellerNetEarningsCents = totalCents - platformFeeCents;

  return {
    subtotalCents: safeSubtotal,
    deliveryFeeCents,
    totalCents,
    platformFeeCents,
    sellerNetEarningsCents,
  };
}

/**
 * Calculates total seller dashboard statistics from an array of completed order totals.
 */
export function calculateSellerDashboardStats(orders: Array<{ subtotalCents: number; status: string }>) {
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const count = completedOrders.length;

  const grossSalesCents = completedOrders.reduce((sum, o) => {
    const fees = calculateOrderFees(o.subtotalCents);
    return sum + fees.totalCents;
  }, 0);

  const totalPlatformFeesCents = count * PLATFORM_DEVELOPER_FEE_CENTS;
  const netEarningsCents = grossSalesCents - totalPlatformFeesCents;

  return {
    completedOrdersCount: count,
    grossSalesCents,
    totalPlatformFeesCents,
    netEarningsCents,
  };
}
