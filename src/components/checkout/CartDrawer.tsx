'use client';

import React, { useState } from 'react';
import { X, Trash2, MapPin, ShieldCheck, ArrowRight, CheckCircle, CreditCard } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useCampusStore } from '@/store/useCampusStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatZAR } from '@/services/finance';
import { MOCK_ORDERS } from '@/lib/mock-data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const createOrderMetadata = () => {
  const id = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  return {
    id: `ord-${id}`,
    orderNumber: `CC-${id.slice(0, 8).toUpperCase()}`,
    timestamp,
  };
};

const PAYMENT_METHODS = [
  { id: 'instant_eft', label: 'Instant EFT (PayShap / Capitec / FNB / Nedbank / Standard Bank)', popular: true },
  { id: 'payshap', label: 'PayShap / Cellphone Banking', popular: false },
  { id: 'card', label: 'Credit / Debit Card', popular: false },
] as const;

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, clearCart, getFeeBreakdown } = useCartStore();
  const { selectedCampus, selectedDeliveryLocationId, setDeliveryLocationId, customInstructions, setCustomInstructions } = useCampusStore();
  const { user } = useAuthStore();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'instant_eft' | 'card' | 'payshap'>('instant_eft');
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');

  if (!isOpen) return null;

  const feeBreakdown = getFeeBreakdown();

  const handleProceedToCheckout = () => {
    if (items.length === 0) return;
    setCheckoutStep('checkout');
  };

  const handlePlaceOrder = () => {
    const orderMetadata = createOrderMetadata();
    const orderNum = orderMetadata.orderNumber;
    setCreatedOrderNumber(orderNum);
    setCheckoutStep('success');

    // Add mock order for order tracking
    const selectedLocationObj = selectedCampus.deliveryLocations.find((l) => l.id === selectedDeliveryLocationId);
    MOCK_ORDERS.unshift({
      id: orderMetadata.id,
      orderNumber: orderNum,
      buyerId: user?.id || 'demo-buyer',
      buyerName: user?.fullName || 'Campus Student',
      buyerPhone: user?.phoneNumber || '+27820000000',
      sellerId: items[0]?.product.sellerId || 'seller-1',
      sellerName: items[0]?.product.sellerName || 'Student Bites',
      campusId: selectedCampus.id,
      campusName: selectedCampus.name,
      deliveryLocationId: selectedDeliveryLocationId || 'loc-1',
      deliveryLocationName: selectedLocationObj?.name || 'Library Entrance',
      customLocationInstructions: customInstructions,
      status: 'pending',
      items: items.map((item, idx) => ({
        id: `item-${idx}`,
        productId: item.product.id,
        productName: item.product.name,
        unitPriceCents: item.product.priceCents,
        quantity: item.quantity,
        totalPriceCents: item.product.priceCents * item.quantity,
      })),
      subtotalCents: feeBreakdown.subtotalCents,
      deliveryFeeCents: feeBreakdown.deliveryFeeCents,
      totalCents: feeBreakdown.totalCents,
      platformFeeCents: feeBreakdown.platformFeeCents,
      sellerNetEarningsCents: feeBreakdown.sellerNetEarningsCents,
      paymentStatus: 'paid',
      paymentMethod: paymentMethod === 'instant_eft' ? 'Instant EFT' : paymentMethod === 'payshap' ? 'PayShap' : 'Card',
      createdAt: orderMetadata.timestamp,
      updatedAt: orderMetadata.timestamp,
    });

    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-gray-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden">

        {/* HEADER */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div>
            <h2 className="font-black text-gray-900 text-base">
              {checkoutStep === 'cart' ? 'Your Shopping Basket' : checkoutStep === 'checkout' ? 'Order Checkout' : 'Order Confirmed! 🎉'}
            </h2>
            <p className="text-xs text-gray-500">
              {selectedCampus.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200/80 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: CART LIST */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl mb-3">
                  🛒
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Your cart is empty</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Browse delicious snacks, meals & drinks sold by student sellers on {selectedCampus.name}.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl border border-gray-100 p-3 shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs truncate">{item.product.name}</h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Sold by {item.product.sellerName}
                    </p>
                    <p className="text-xs font-black text-emerald-700 mt-1">
                      {formatZAR(item.product.priceCents * item.quantity)}
                    </p>
                  </div>

                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white shadow-2xs font-bold text-gray-800 text-xs flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-emerald-600 font-bold text-white text-xs flex items-center justify-center hover:bg-emerald-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT FORM */}
        {checkoutStep === 'checkout' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-5">

            {/* DELIVERY LOCATION SELECTOR */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Select Drop-off Meeting Point
              </label>
              <select
                value={selectedDeliveryLocationId || ''}
                onChange={(e) => setDeliveryLocationId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {selectedCampus.deliveryLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} {loc.isPopular ? '⭐ Popular' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* CUSTOM INSTRUCTIONS */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                Custom Spot / Instructions
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="E.g. Meet outside Computer Science Lab 2. Wearing a blue hoodie."
                rows={2}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* PAYMENT METHOD */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Select Payment Method
              </label>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs font-bold ${
                      paymentMethod === method.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{method.label}</span>
                    {method.popular && (
                      <span className="bg-emerald-600 text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase">
                        Fastest
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* TRANSPARENT FINANCIAL BREAKDOWN */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-bold text-gray-900">{formatZAR(feeBreakdown.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Campus Delivery Fee</span>
                <span className="font-bold text-emerald-700">{formatZAR(feeBreakdown.deliveryFeeCents)}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                <span>Total Amount to Pay</span>
                <span className="text-emerald-700">{formatZAR(feeBreakdown.totalCents)}</span>
              </div>
              <p className="text-[10px] text-gray-500 pt-1 leading-relaxed">
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline mr-1" />
                Guaranteed safe delivery by student seller directly to your campus spot.
              </p>
            </div>

          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {checkoutStep === 'success' && (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Order Placed!</h3>
            <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
              Order <span className="font-bold text-emerald-700">{createdOrderNumber}</span> has been sent to the seller. They will accept and deliver it to your selected spot.
            </p>
            <div className="w-full bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-left text-xs space-y-1">
              <p className="font-bold text-emerald-900">Delivery Details:</p>
              <p className="text-emerald-800">Campus: {selectedCampus.name}</p>
              <p className="text-emerald-800">Delivery Fee: R2.00 (Included)</p>
            </div>
          </div>
        )}

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t border-gray-100 bg-white">
          {checkoutStep === 'cart' && (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-gray-500">Subtotal</span>
                <span className="font-black text-base text-gray-900">{formatZAR(feeBreakdown.subtotalCents)}</span>
              </div>
              <button
                disabled={items.length === 0}
                onClick={handleProceedToCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Checkout · {formatZAR(feeBreakdown.totalCents)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {checkoutStep === 'checkout' && (
            <div className="flex gap-2">
              <button
                onClick={() => setCheckoutStep('cart')}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-2xl transition-all"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Pay & Place Order ({formatZAR(feeBreakdown.totalCents)})</span>
              </button>
            </div>
          )}

          {checkoutStep === 'success' && (
            <button
              onClick={() => {
                setCheckoutStep('cart');
                onClose();
              }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-3.5 rounded-2xl transition-all cursor-pointer"
            >
              Done & Track Order
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
