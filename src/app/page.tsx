'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { CategoryChips } from '@/components/marketplace/CategoryChips';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { StoreCard } from '@/components/marketplace/StoreCard';
import { useCampusStore } from '@/store/useCampusStore';
import { useAuthStore } from '@/store/useAuthStore';
import { MOCK_PRODUCTS, MOCK_SELLERS, MOCK_ORDERS, MOCK_MESSAGES } from '@/lib/mock-data';
import { formatZAR, calculateSellerDashboardStats } from '@/services/finance';
import { Product, OrderStatus } from '@/types';
import { Search, Sparkles, Send, X, Plus } from 'lucide-react';

export default function Home() {
  const { selectedCampus } = useCampusStore();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'orders' | 'chat' | 'seller'>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('cat-all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Chat state
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [chatInput, setChatInput] = useState('');

  // Seller Dashboard state
  const [sellerProducts, setSellerProducts] = useState(MOCK_PRODUCTS.filter(p => p.sellerId === 'seller-1'));
  const [newProductName, setNewProductName] = useState('');
  const [newProductPriceRand, setNewProductPriceRand] = useState('');
  const newProductCategory = 'cat-meals';
  const [newProductDesc, setNewProductDesc] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Orders list state
  const [ordersList, setOrdersList] = useState(MOCK_ORDERS);

  // Filter products by campus and category
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      const matchesCampus = product.campusIds.includes(selectedCampus.id) || product.campusIds.includes('cput-bellville') || true;
      const matchesCategory = selectedCategoryId === 'cat-all' || product.categoryId === selectedCategoryId;
      const matchesSearch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCampus && matchesCategory && matchesSearch;
    });
  }, [selectedCampus.id, selectedCategoryId, searchQuery]);

  // Seller Dashboard calculations using finance.ts
  const sellerStats = useMemo(() => {
    return calculateSellerDashboardStats(
      ordersList.filter(o => o.sellerId === 'seller-1').map(o => ({ subtotalCents: o.subtotalCents, status: o.status }))
    );
  }, [ordersList]);

  // Send Chat message
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage = {
      id: `msg-${Date.now()}`,
      orderId: 'ord-1001',
      senderId: user?.id || 'demo-user',
      senderName: user?.fullName || 'Sipho Zulu',
      senderRole: (user?.role || 'buyer') as 'buyer' | 'seller',
      receiverId: 'seller-1',
      content: chatInput,
      isRead: true,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setChatInput('');
  };

  // Update order status
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus, updatedAt: new Date().toISOString() } : o))
    );
  };

  // Add Product to Seller Store
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPriceRand) return;

    const priceCents = Math.round(parseFloat(newProductPriceRand) * 100);
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      sellerId: 'seller-1',
      sellerName: 'Student Bites',
      sellerSlug: 'student-bites',
      sellerRating: 4.8,
      categoryId: newProductCategory,
      categoryName: 'Meals',
      name: newProductName,
      slug: newProductName.toLowerCase().replace(/\s+/g, '-'),
      description: newProductDesc || 'Fresh student listing on campus',
      priceCents,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
      isAvailable: true,
      campusIds: [selectedCampus.id],
      tag: 'New Listing',
      eta: '8-12 min',
      createdAt: new Date().toISOString(),
    };

    setSellerProducts((prev) => [newProd, ...prev]);
    setIsAddProductOpen(false);
    setNewProductName('');
    setNewProductPriceRand('');
    setNewProductDesc('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20 md:pb-8">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* VIEW 1: HOME & MARKETPLACE */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fadeIn">

            {/* HERO BANNER */}
            <div className="relative rounded-3xl bg-gradient-to-br from-emerald-900 via-gray-900 to-emerald-950 p-6 sm:p-8 text-white overflow-hidden shadow-lg border border-emerald-800/40">
              <div className="relative z-10 max-w-xl space-y-3">
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  {selectedCampus.universityName} Student Marketplace
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                  Need a snack? Stay in your seat.
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-normal">
                  Order fresh food and snacks from student sellers at <span className="font-bold text-white">{selectedCampus.name}</span>. Delivered directly to your lecture hall or library.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold px-3 py-1 rounded-xl">
                    R2.00 Delivery Fee
                  </span>
                  <span className="bg-amber-400/20 text-amber-200 border border-amber-400/30 text-[11px] font-bold px-3 py-1 rounded-xl">
                    Instant EFT / PayShap
                  </span>
                </div>
              </div>

              {/* Decorative Circle Background */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* SEARCH BAR */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food, snacks or sellers..."
                className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-gray-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* CATEGORIES */}
            <div>
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                Categories
              </h2>
              <CategoryChips
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            </div>

            {/* POPULAR NEAR YOU (PRODUCT GRID) */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-black text-gray-900 tracking-tight">
                    Popular Near You
                  </h2>
                  <p className="text-xs text-gray-500">
                    Available now on {selectedCampus.name}
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                  {filteredProducts.length} Items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={(p) => setSelectedProduct(p)}
                  />
                ))}
              </div>
            </section>

            {/* STUDENT FAVOURITES / SELLERS NEAR YOU */}
            <section className="pt-4 border-t border-gray-200/60">
              <h2 className="text-base font-black text-gray-900 tracking-tight mb-3">
                Student Sellers on Campus
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MOCK_SELLERS.map((seller) => (
                  <StoreCard key={seller.id} seller={seller} />
                ))}
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="space-y-4 animate-fadeIn">
            <h1 className="text-lg font-black text-gray-900">Search Marketplace</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food, snacks, drinks or sellers..."
                className="w-full bg-white border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm font-medium text-gray-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: ORDERS TRACKER */}
        {activeTab === 'orders' && (
          <div className="space-y-4 max-w-2xl mx-auto animate-fadeIn">
            <h1 className="text-xl font-black text-gray-900">Order History & Tracking</h1>

            {ordersList.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <span className="font-black text-gray-900 text-sm">{order.orderNumber}</span>
                    <p className="text-xs text-gray-500">{order.sellerName} · {order.campusName}</p>
                  </div>

                  {/* VISUAL STATUS BADGE */}
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'delivering' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="space-y-1.5 text-xs text-gray-700">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity} × {item.productName}</span>
                      <span className="font-bold">{formatZAR(item.totalPriceCents)}</span>
                    </div>
                  ))}
                </div>

                {/* FINANCIAL BREAKDOWN */}
                <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1 border border-gray-100">
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span>{formatZAR(order.deliveryFeeCents)}</span>
                  </div>
                  <div className="flex justify-between font-black text-gray-900 pt-1 border-t border-gray-200">
                    <span>Total Paid</span>
                    <span className="text-emerald-700">{formatZAR(order.totalCents)}</span>
                  </div>
                </div>

                {/* VISUAL ORDER STEP TRACKER */}
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Flow Progress</p>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
                    <span className={order.status === 'pending' ? 'text-amber-600 font-black' : ''}>Pending</span>
                    <span>→</span>
                    <span className={order.status === 'accepted' ? 'text-emerald-600 font-black' : ''}>Accepted</span>
                    <span>→</span>
                    <span className={order.status === 'preparing' ? 'text-emerald-600 font-black' : ''}>Preparing</span>
                    <span>→</span>
                    <span className={order.status === 'delivering' ? 'text-blue-600 font-black' : ''}>Delivering</span>
                    <span>→</span>
                    <span className={order.status === 'delivered' ? 'text-emerald-700 font-black' : ''}>Delivered</span>
                  </div>
                </div>

                {/* ACTION CHAT BUTTON */}
                <button
                  onClick={() => setActiveTab('chat')}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Chat with {order.sellerName}</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 4: CHAT */}
        {activeTab === 'chat' && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-xs h-[75vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* CHAT HEADER */}
            <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm">Student Bites</h2>
                <p className="text-[10px] text-emerald-400 font-medium">Order CC-8901 · CPUT Bellville Library</p>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                Online
              </span>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
              {messages.map((msg) => {
                const isMe = msg.senderRole === 'buyer';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none shadow-2xs'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-2xs'
                      }`}
                    >
                      <p className="font-bold text-[10px] opacity-80 mb-0.5">{msg.senderName}</p>
                      <p>{msg.content}</p>
                      <span className="text-[9px] opacity-60 block text-right mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CHAT INPUT */}
            <div className="p-3 border-t border-gray-200 bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message to the seller..."
                className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 5: SELLER DASHBOARD */}
        {activeTab === 'seller' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-gray-900">Seller Dashboard</h1>
                <p className="text-xs text-gray-500">Store: <span className="font-bold text-gray-800">Student Bites</span> (CPUT Bellville)</p>
              </div>
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* DASHBOARD STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
                <span className="text-xs text-gray-500 font-medium block">Completed Orders</span>
                <span className="text-2xl font-black text-gray-900 mt-1 block">
                  {sellerStats.completedOrdersCount}
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
                <span className="text-xs text-gray-500 font-medium block">Gross Sales</span>
                <span className="text-2xl font-black text-emerald-700 mt-1 block">
                  {formatZAR(sellerStats.grossSalesCents)}
                </span>
              </div>

              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4 shadow-2xs">
                <span className="text-xs text-amber-900 font-medium block">Platform Fees (R0.50/order)</span>
                <span className="text-2xl font-black text-amber-700 mt-1 block">
                  {formatZAR(sellerStats.totalPlatformFeesCents)}
                </span>
              </div>

              <div className="bg-emerald-950 text-white rounded-2xl p-4 shadow-md">
                <span className="text-xs text-emerald-300 font-medium block">Net Seller Earnings</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {formatZAR(sellerStats.netEarningsCents)}
                </span>
              </div>
            </div>

            {/* ACTIVE ORDERS FOR SELLER TO UPDATE */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
              <h2 className="font-bold text-gray-900 text-sm mb-3">Manage Orders</h2>
              <div className="space-y-3">
                {ordersList.map((ord) => (
                  <div key={ord.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-gray-900">{ord.orderNumber} · {ord.buyerName}</p>
                      <p className="text-gray-500">{ord.deliveryLocationName} ({ord.customLocationInstructions})</p>
                      <p className="text-emerald-700 font-bold mt-0.5">Net Payout: {formatZAR(ord.sellerNetEarningsCents)} (R0.50 fee deducted)</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-400 uppercase mr-1">Status:</span>
                      {(['pending', 'accepted', 'preparing', 'ready', 'delivering', 'delivered'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateOrderStatus(ord.id, st)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                            ord.status === st ? 'bg-emerald-600 text-white shadow-2xs' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STORE PRODUCTS MANAGEMENT */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
              <h2 className="font-bold text-gray-900 text-sm mb-3">Store Products ({sellerProducts.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sellerProducts.map((p) => (
                  <div key={p.id} className="p-3 border border-gray-200 rounded-xl flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 text-xs">{p.name}</h3>
                      <p className="text-emerald-700 font-black text-xs mt-0.5">{formatZAR(p.priceCents)}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Available
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL: PRODUCT DETAILS PAGE */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="relative h-56 bg-gray-100">
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                fill
                sizes="(max-width: 448px) 100vw, 448px"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-gray-700 flex items-center justify-center shadow-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {selectedProduct.categoryName}
                </span>
                <h2 className="text-lg font-black text-gray-900 mt-1">{selectedProduct.name}</h2>
                <p className="text-xs text-gray-500 mt-1">{selectedProduct.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Price</span>
                  <span className="text-xl font-black text-emerald-700">{formatZAR(selectedProduct.priceCents)}</span>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-gray-900 block">{selectedProduct.sellerName}</span>
                  <span className="text-gray-500">⭐ {selectedProduct.sellerRating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT FORM */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-5 border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-black text-gray-900 text-base">Add New Listing</h2>
              <button onClick={() => setIsAddProductOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-800 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Chicken Gatsby"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Price in ZAR (Rands)</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  placeholder="E.g. 35.00"
                  value={newProductPriceRand}
                  onChange={(e) => setNewProductPriceRand(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Description</label>
                <textarea
                  placeholder="Freshly prepared on campus..."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 resize-none"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Publish Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
