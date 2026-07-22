import React, { useState } from "react";
import { 
  Store, 
  ShieldCheck, 
  Tag, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle, 
  CreditCard, 
  ChevronRight, 
  MapPin, 
  Truck, 
  ArrowRight, 
  User, 
  Phone, 
  Check, 
  RefreshCw, 
  X, 
  Building2,
  Package,
  FileSpreadsheet
} from "lucide-react";

export interface Product {
  id: string;
  name: string;
  category: "apparel" | "gear" | "digital";
  price: number; // in Credits
  description: string;
  image: string;
  stock: number;
  rating: number;
  badge?: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface MarketplaceViewProps {
  walletBalance: number;
  onUpdateWallet: (amt: number) => void;
  onAddTransaction: (amt: number, target: string) => void;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "LookUpto Pro Windbreaker Jacket",
    category: "apparel",
    price: 85.00,
    description: "Official windproof tech jacket worn by the staff and professional sports scouts. Moisture-wicking premium sports lining with double ventilation panels.",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=300&auto=format&fit=crop",
    stock: 24,
    rating: 4.9,
    badge: "Staff Choice"
  },
  {
    id: "prod-2",
    name: "WorldCup '26 Grand Gold Soccer Ball",
    category: "gear",
    price: 65.00,
    description: "Limited edition LookUpto premium high-grip match soccer ball, aerodynamic synthetic leather structure optimized for accurate free-kick trajectories.",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&auto=format&fit=crop",
    stock: 12,
    rating: 4.8,
    badge: "Limited Edition"
  },
  {
    id: "prod-3",
    name: "LookUpto Smart Predictor Wristband v2",
    category: "gear",
    price: 180.00,
    description: "The ultimate Wearable device. Consumes active Bluetooth signals to display immediate live odds updates and custom staker challenge notifications on your wrist.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop",
    stock: 8,
    rating: 5.0,
    badge: "Best Seller"
  },
  {
    id: "prod-4",
    name: "Corporate VIP Lifetime Lounge Pass",
    category: "digital",
    price: 450.00,
    description: "Instant access to high-tier premium VIP Rooms, analytical LookUpto odds-modeling resources, and absolute direct zero-tax on all host challenge commissions.",
    image: "https://images.unsplash.com/photo-1540747737956-378724044453?q=80&w=300&auto=format&fit=crop",
    stock: 99,
    rating: 4.9,
    badge: "Lifetime Access"
  },
  {
    id: "prod-5",
    name: "LookUpto Sports Elite Predictor Cap",
    category: "apparel",
    price: 32.50,
    description: "Signature midnight charcoal snapback cap with embroidered gold thread. Includes a secure internal ticket pocket and moisture absorbing comfort band.",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=300&auto=format&fit=crop",
    stock: 45,
    rating: 4.6
  },
  {
    id: "prod-6",
    name: "Pro Sports Predictor Bundle Pro",
    category: "digital",
    price: 95.00,
    description: "Standard algorithmic sheets and private predictor strategies. Automatically unlocks 12 monthly credits of deep LookUp odds analysis toolbars.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop",
    stock: 150,
    rating: 4.7,
    badge: "Highly Popular"
  }
];

export default function MarketplaceView({ 
  walletBalance, 
  onUpdateWallet, 
  onAddTransaction 
}: MarketplaceViewProps) {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | "apparel" | "gear" | "digital">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<"browse" | "checkout" | "invoices">("browse");

  // Shipping details state
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingCity, setShippingCity] = useState("Nairobi");
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet");
  
  // Credit card details if selected
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Invoice success receipts cache
  const [invoices, setInvoices] = useState<Array<{
    invoiceId: string;
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    date: string;
    shippingName: string;
    shippingAddress: string;
    shippingCity: string;
    paymentMethod: string;
  }>>([]);

  const [activeSuccessInvoice, setActiveSuccessInvoice] = useState<any | null>(null);

  // Filter products based on search query and category tab
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategoryFilter === "all" ? true : p.category === activeCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart operations
  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const updated = cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[];
    setCart(updated);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  // Calculations
  const getSubtotal = () => cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const getShippingCost = () => {
    // Digital products have free shipping, others $10 flat or $15 express
    const hasPhysical = cart.some(item => item.product.category !== "digital");
    return hasPhysical ? 15.00 : 0.00;
  };
  const getTotal = () => getSubtotal() + getShippingCost();

  // Perform purchase checkout
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const subtotal = getSubtotal();
    const shipping = getShippingCost();
    const total = getTotal();

    // Verify Wallet Balance if chosen
    if (paymentMethod === "wallet") {
      if (walletBalance < total) {
        alert(`Insufficient Funds! You need $${total.toFixed(2)} Credits, but only have $${walletBalance.toFixed(2)} in your sports wallet. Please deposit first or select Credit Card payment.`);
        return;
      }
      
      // Deduct from wallet
      onUpdateWallet(-total);
      
      // Save Transaction History Log
      const itemNames = cart.map(item => `${item.product.name} (x${item.quantity})`).join(", ");
      onAddTransaction(total, `Corporate Marketplace Purchase: ${itemNames}`);
    } else {
      // Dummy check for credit card
      if (!cardNumber || !cardExpiry || !cardCvv) {
        alert("Please completely fill your credit card credentials to securely process the order.");
        return;
      }
    }

    // Generate Invoice Receipt
    const newInvoice = {
      invoiceId: "INV-" + Math.floor(100000 + Math.random() * 900000),
      items: [...cart],
      subtotal,
      shippingCost: shipping,
      total,
      date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      shippingName: shippingName || "Valued LookUpto Staker",
      shippingAddress: shippingAddress || "Default Corporate Locker pick-up",
      shippingCity: shippingCity,
      paymentMethod: paymentMethod === "wallet" ? "LookUpto Account Wallet" : "Credit Card (Visa/Mastercard)"
    };

    setInvoices([newInvoice, ...invoices]);
    setActiveSuccessInvoice(newInvoice);
    setCart([]); // Reset Cart
    setActiveSubTab("invoices"); // Go to invoices log
    alert("Purchase success! Your organizational order has been created and registered securely with LookUpto HQ.");
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200 font-sans w-full max-w-7xl mx-auto">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-teal-850 to-indigo-950 p-6 rounded-2xl text-white relative overflow-hidden shadow-md border border-gray-250 dark:border-zinc-800">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-8 -translate-y-6">
          <Store className="w-80 h-80" />
        </div>
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#ffd000] text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Building2 className="w-3 h-3" />
              OFFICIAL ORGANIZATION STORE
            </span>
            <span className="bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              100% Certified
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            LookUpto Corporate Marketplace
          </h2>
          <p className="text-xs sm:text-xs text-gray-200 dark:text-gray-300 font-normal leading-relaxed max-w-md">
            Purchase official team apparel, premium predictor gadgets, and VIP certification keys online directly from our organization. Use your predicting predictions winnings balance or standard cards securely.
          </p>
        </div>
      </div>

      {/* 2. Subtabs Navigation & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-[#242526] p-3.5 border border-gray-200 dark:border-zinc-800 rounded-2xl gap-4 shadow-sm select-none">
        
        {/* Nav Tabs */}
        <div className="flex bg-gray-50 dark:bg-[#18191a] p-1.5 rounded-xl gap-1 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => { setActiveSubTab("browse"); setActiveSuccessInvoice(null); }}
            className={`px-4 py-2 font-black text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === "browse" 
                ? "bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs" 
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Browse Catalog
          </button>
          
          <button
            onClick={() => { setActiveSubTab("checkout"); setActiveSuccessInvoice(null); }}
            className={`px-4 py-2 font-black text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap relative cursor-pointer ${
              activeSubTab === "checkout" 
                ? "bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs" 
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Checkout Form
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center animate-bounce">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveSubTab("invoices"); }}
            className={`px-4 py-2 font-black text-xs rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === "invoices" 
                ? "bg-white dark:bg-[#242526] text-[#1877f2] shadow-xs" 
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Org Invoices & Receipts {invoices.length > 0 && `(${invoices.length})`}
          </button>
        </div>

        {/* Search Catalog Input (visible only in browse) */}
        {activeSubTab === "browse" && (
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#18191a] outline-hidden placeholder-gray-400 text-xs text-gray-900 dark:text-gray-100 rounded-xl py-2 pl-9 pr-4 border border-gray-200 dark:border-zinc-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Main Switchable Content */}
      {activeSubTab === "browse" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* CATALOG MAIN BODY (Width: 3/4) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Category Filter Pills */}
            <div className="flex gap-2 overflow-x-auto select-none pb-1">
              {[
                { id: "all", label: "🛒 View All Products" },
                { id: "apparel", label: "👕 Team Apparel & Merch" },
                { id: "gear", label: "👟 Predictor Gear" },
                { id: "digital", label: "🔑 Exclusive Access Keys" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border whitespace-nowrap cursor-pointer transition-all ${
                    activeCategoryFilter === cat.id
                      ? "bg-[#1877f2] text-white border-[#1877f2] shadow-xs"
                      : "bg-white dark:bg-[#242526] text-gray-650 dark:text-gray-300 border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-[#242526] rounded-2xl p-12 text-center border border-gray-200 dark:border-zinc-800">
                <Store className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-600 mb-3" />
                <h3 className="font-bold text-gray-800 dark:text-gray-200">No organizational products found</h3>
                <p className="text-xs text-gray-500 mt-1">Try resetting your search query or switching categories.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((p) => (
                  <div key={p.id} className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between overflow-hidden group hover:shadow-md hover:border-gray-300 dark:hover:border-zinc-750 transition-all text-left">
                    
                    {/* Top Image & Badge */}
                    <div className="h-44 w-full bg-gray-100 dark:bg-zinc-800 relative overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {p.badge && (
                        <span className="absolute left-3.5 top-3.5 bg-indigo-600 text-white font-mono font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                          {p.badge}
                        </span>
                      )}
                      
                      <div className="absolute right-3.5 bottom-3.5 bg-black/75 backdrop-blur-xs text-yellow-450 font-black text-xs px-2.5 py-1 rounded-lg">
                        ${p.price.toFixed(2)} Credits
                      </div>
                    </div>

                    {/* Middle Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono font-black tracking-widest text-[#1877f2] block">
                          {p.category === "apparel" ? "👔 Apparel & Merch" : p.category === "gear" ? "⚡ Gear & Gadgets" : "💎 Digital VIP Keys"}
                        </span>
                        <h4 className="font-extrabold text-sm sm:text-[14.5px] leading-snug text-gray-900 dark:text-white line-clamp-1 group-hover:text-[#1877f2] transition-colors">
                          {p.name}
                        </h4>
                        <p className="text-[11.5px] leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-2">
                          {p.description}
                        </p>
                      </div>

                      {/* Stock, Rating, and Button */}
                      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 font-bold text-xs">★</span>
                            <span className="font-bold text-xs text-gray-800 dark:text-gray-200">{p.rating}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 block">
                            Stock: <span className="font-mono text-emerald-500 font-black">{p.stock} left</span>
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            addToCart(p);
                            alert(`Added "${p.name}" to your organizational checkout cart!`);
                          }}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add to Cart
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SHOPPING CART INTEGRATION SIDEBAR (Width: 1/4) */}
          <div className="lg:col-span-1 bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm text-left sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-150 dark:border-zinc-800 pb-2.5 mb-4 select-none">
              <h3 className="font-mono font-black text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#1877f2]" />
                Cart Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
              </h3>
              {cart.length > 0 && (
                <button 
                  onClick={() => setCart([])}
                  className="text-[10px] text-zinc-400 hover:text-red-500 font-bold uppercase transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                <ShoppingBag className="w-8 h-8 text-gray-200 dark:text-zinc-700 mx-auto mb-2" />
                <p className="text-xs font-black">Your Shopping Cart is Empty</p>
                <p className="text-[10px] text-gray-500 mt-1 max-w-[180px] mx-auto">Catalog selected goods as an organization will register here instantly for processing.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart Items list */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-2.5 p-2 bg-gray-55/70 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800 relative group text-xs">
                      
                      {/* Product Image */}
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-10 h-10 rounded-lg object-cover bg-gray-200"
                        referrerPolicy="no-referrer"
                      />

                      {/* Info & Quantity controls */}
                      <div className="flex-1 space-y-1">
                        <h5 className="font-extrabold text-gray-900 dark:text-gray-100 line-clamp-1 pr-4">
                          {item.product.name}
                        </h5>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-500 font-mono">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          
                          {/* Quantity Counter */}
                          <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg px-1 py-0.5">
                            <button onClick={() => updateQuantity(item.product.id, -1)} className="text-gray-500 hover:text-gray-800">
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="font-mono font-black text-[10px] text-gray-800 dark:text-gray-200 px-1">
                              {item.quantity}
                            </span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} className="text-gray-500 hover:text-gray-800">
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove item button */}
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="absolute right-1 top-1 text-gray-400 hover:text-rose-500 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  ))}
                </div>

                {/* Pricing summary */}
                <div className="space-y-1.5 pt-3 border-t border-gray-150 dark:border-zinc-800 text-[11px] font-sans">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal:</span>
                    <span className="font-mono font-bold">${getSubtotal().toFixed(2)} Credits</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping Cost:</span>
                    <span className="font-mono font-bold">
                      {getShippingCost() === 0 ? "FREE" : `$${getShippingCost().toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-gray-950 dark:text-gray-100 pt-1.5 border-t border-dashed border-gray-200 dark:border-zinc-800">
                    <span>Grand Total:</span>
                    <span className="font-mono text-emerald-550">${getTotal().toFixed(2)} Credits</span>
                  </div>
                </div>

                {/* Continue to Checkout Form */}
                <button
                  onClick={() => {
                    setActiveSubTab("checkout");
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className="w-full bg-[#1877f2] hover:bg-blue-750 text-white font-black text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Go to Checkout Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. Checkout Interactive Form Area */}
      {activeSubTab === "checkout" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Checkout billing & shipping details */}
          <div className="lg:col-span-2 bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 shadow-xs text-left">
            <h3 className="font-black text-base text-gray-900 dark:text-white pb-3.5 border-b border-gray-150 dark:border-zinc-800 mb-5 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-500" />
              Organizational Sales & Shipping Dispatch
            </h3>

            {cart.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Store className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                <p className="font-black text-xs text-gray-800 dark:text-gray-400">Your Checkout Cart is Empty</p>
                <p className="text-[11px] mt-1">Please return to the Catalog browser to add products before typing dispatch details.</p>
                <button
                  type="button"
                  onClick={() => { setActiveSubTab("browse"); }}
                  className="mt-4 inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950 text-blue-500 font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl border border-blue-105"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-6 font-sans">
                
                {/* Shipping info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#1877f2]" />
                    <span>Recipient Shipping Location</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Recipient Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-450" />
                        <input
                          type="text"
                          required
                          value={shippingName}
                          onChange={(e) => setShippingName(e.target.value)}
                          placeholder="e.g. Zephaniah Mwangi"
                          className="w-full bg-gray-50/75 dark:bg-[#18191a] outline-hidden placeholder-gray-400 text-xs text-gray-900 dark:text-gray-100 rounded-xl py-2 pl-9 pr-4 border border-gray-200 dark:border-zinc-800 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Recipient Mobile Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-450" />
                        <input
                          type="tel"
                          required
                          value={shippingPhone}
                          onChange={(e) => setShippingPhone(e.target.value)}
                          placeholder="e.g. +254 712 345678"
                          className="w-full bg-gray-50/75 dark:bg-[#18191a] outline-hidden placeholder-gray-400 text-xs text-gray-900 dark:text-gray-100 rounded-xl py-2 pl-9 pr-4 border border-gray-200 dark:border-zinc-800 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Detailed Corporate/Residential Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-450" />
                        <input
                          type="text"
                          required
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="e.g. LookUpto Plaza, Floor 4, Suite 12A"
                          className="w-full bg-gray-50/75 dark:bg-[#18191a] outline-hidden placeholder-gray-400 text-xs text-gray-900 dark:text-gray-100 rounded-xl py-2 pl-9 pr-4 border border-gray-200 dark:border-zinc-800 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-600 dark:text-gray-300">Dispatch City *</label>
                      <select
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full bg-gray-50/75 dark:bg-[#18191a] outline-hidden text-xs text-gray-900 dark:text-gray-100 rounded-xl py-2 px-3 border border-gray-200 dark:border-zinc-800 focus:border-blue-500"
                      >
                        <option value="Nairobi">Nairobi</option>
                        <option value="Mombasa">Mombasa</option>
                        <option value="Kisumu">Kisumu</option>
                        <option value="Nakuru">Nakuru</option>
                        <option value="Eldoret">Eldoret</option>
                        <option value="Global Shipping">Global Express Cargo</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Payment Option Selection */}
                <div className="space-y-4 pt-4 border-t border-gray-150 dark:border-zinc-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                    <span>Select Organization Payment Protocol</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Pay with prediction wallet */}
                    <div 
                      onClick={() => setPaymentMethod("wallet")}
                      className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between h-24 ${
                        paymentMethod === "wallet"
                          ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs ring-2 ring-emerald-500/10"
                          : "border-gray-200 dark:border-zinc-800 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-800 dark:text-gray-200">LookUpto Account Wallet</span>
                        {paymentMethod === "wallet" ? (
                          <div className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">✓</div>
                        ) : (
                          <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-mono">Current Balance</span>
                        <span className="font-mono text-emerald-500 font-black text-sm">${walletBalance.toFixed(2)} Credits</span>
                      </div>
                    </div>

                    {/* Pay with debit credit card */}
                    <div 
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3.5 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between h-24 ${
                        paymentMethod === "card"
                          ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/25 shadow-xs ring-2 ring-blue-500/10"
                          : "border-gray-200 dark:border-zinc-800 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-800 dark:text-gray-200">Visa / Mastercard</span>
                        {paymentMethod === "card" ? (
                          <div className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">✓</div>
                        ) : (
                          <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500">Secure corporate organization billing clearance</span>
                    </div>

                  </div>

                  {/* Card input if chosen card */}
                  {paymentMethod === "card" && (
                    <div className="p-4 bg-gray-50 dark:bg-[#18191a] rounded-2xl border border-gray-150 dark:border-zinc-800 space-y-3 animate-in slide-in-from-top-3 duration-200">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase font-black text-gray-400">Debit card digits *</label>
                        <input
                          type="text"
                          required={paymentMethod === "card"}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-white dark:bg-[#242526] outline-hidden placeholder-gray-400 text-xs text-gray-900 dark:text-gray-100 rounded-lg py-1.5 px-3 border border-gray-200 dark:border-zinc-800"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase font-black text-gray-400">Expiration date *</label>
                          <input
                            type="text"
                            required={paymentMethod === "card"}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-white dark:bg-[#242526] outline-hidden placeholder-gray-400 text-xs text-gray-900 dark:text-gray-100 rounded-lg py-1.5 px-3 border border-gray-200 dark:border-zinc-800"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase font-black text-gray-400">CVV Secure code *</label>
                          <input
                            type="text"
                            required={paymentMethod === "card"}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="123"
                            className="w-full bg-white dark:bg-[#242526] outline-hidden placeholder-gray-400 text-xs text-gray-900 dark:text-gray-100 rounded-lg py-1.5 px-3 border border-gray-200 dark:border-zinc-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dispatch checkout button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Confirm dispatch & Pay ${getTotal().toFixed(2)} Credits
                </button>

              </form>
            )}
          </div>

          {/* Checkout item overview right bar */}
          <div className="lg:col-span-1 space-y-4">
            
            <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm text-left">
              <h3 className="font-black text-sm text-gray-800 dark:text-white pb-2.5 border-b border-gray-150 dark:border-zinc-800 mb-4 select-none">
                Order Overview
              </h3>

              {cart.length === 0 ? (
                <p className="text-xs text-gray-400">No products chosen.</p>
              ) : (
                <div className="space-y-4 animate-in fade-in">
                  
                  {/* Selected products listing summary */}
                  <div className="space-y-3.5">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-start text-xs border-b border-gray-100 dark:border-zinc-800 pb-2.5">
                        <div className="max-w-[70%]">
                          <span className="font-extrabold text-gray-900 dark:text-gray-100 block truncate">{item.product.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono">Qty: {item.quantity} • ${item.product.price.toFixed(2)}</span>
                        </div>
                        <span className="font-mono font-black text-gray-700 dark:text-gray-300">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary math */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Item Subtotal:</span>
                      <span className="font-mono font-bold">${getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping Fee:</span>
                      <span className="font-mono font-bold">
                        {getShippingCost() === 0 ? "FREE" : `$${getShippingCost().toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t border-dashed border-gray-200 dark:border-zinc-800 flex justify-between text-sm font-black text-gray-900 dark:text-white">
                      <span>Grand Total:</span>
                      <span className="font-mono text-emerald-550">${getTotal().toFixed(2)} Credits</span>
                    </div>
                  </div>

                  {/* Guarantee card */}
                  <div className="p-3 bg-indigo-50/50 dark:bg-zinc-850/40 rounded-xl border border-indigo-105-dashed text-[10.5px] leading-relaxed text-gray-500 dark:text-gray-400">
                    <span className="font-bold text-indigo-600 block mb-0.5">Corporate Satisfaction Shield</span>
                    LookUpto ships physical merchandise within 3-5 business days directly under standard predictor clearance stamps. Complete support available inside predicting rooms.
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* 5. Receipts & Corporate Invoices List */}
      {activeSubTab === "invoices" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Invoice logs index sidebar (Width 1/4) */}
          <div className="lg:col-span-1 bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm text-left">
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-500 mb-3 select-none pb-2 border-b border-gray-150 dark:border-zinc-800">
              Purchased Receipts ({invoices.length})
            </h3>

            {invoices.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">No purchases recorded yet for your predictor profile.</p>
            ) : (
              <div className="space-y-2">
                {invoices.map((inv) => (
                  <div
                    key={inv.invoiceId}
                    onClick={() => setActiveSuccessInvoice(inv)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all text-xs text-left ${
                      activeSuccessInvoice?.invoiceId === inv.invoiceId
                        ? "border-[#1877f2] bg-blue-50/50 dark:bg-blue-950/25 ring-2 ring-blue-500/5 font-black text-[#1877f2]"
                        : "border-gray-150 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{inv.invoiceId}</span>
                      <span className="text-[10px] font-mono text-emerald-500 font-extrabold">${inv.total.toFixed(2)}</span>
                    </div>
                    <span className="text-[9.5px] text-gray-405 block font-normal">{inv.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ACTIVE INVOICE IN DEPTH (Width 3/4) */}
          <div className="lg:col-span-3">
            {activeSuccessInvoice ? (
              <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm text-left font-mono">
                
                {/* Header banner brand */}
                <div className="bg-[#1c1d1f] text-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-sm font-black flex items-center gap-1 text-[#ffd000]">
                      <Store className="w-4 h-4" />
                      LookUpto predict-points Official Association Store
                    </h3>
                    <p className="text-[10px] text-gray-400 pt-0.5">Corporate Headquarters: Nairobi Office & Global Logistics Hub</p>
                  </div>
                  <div className="bg-emerald-600 font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md text-white shrink-0 shadow-xs">
                    ✓ Verified Paid
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  
                  {/* Metadata and order info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans border-b border-gray-150 dark:border-zinc-800 pb-5">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-black text-gray-400 block">Dispatch Receipt For</span>
                      <h4 className="font-extrabold text-gray-900 dark:text-white uppercase">{activeSuccessInvoice.shippingName}</h4>
                      <p className="text-gray-500 font-mono text-[11px] leading-relaxed">
                        {activeSuccessInvoice.shippingAddress}, {activeSuccessInvoice.shippingCity}
                      </p>
                    </div>

                    <div className="space-y-1 sm:text-right">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-mono font-black text-gray-400 block">Tax Invoice ID</span>
                        <span className="font-mono font-extrabold text-emerald-500">{activeSuccessInvoice.invoiceId}</span>
                      </div>
                      <div className="pointer-events-none text-gray-500">
                        Date: {activeSuccessInvoice.date}
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        Payment: <span className="font-bold text-gray-750 dark:text-gray-200">{activeSuccessInvoice.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* List of checkout items */}
                  <div className="space-y-3 font-sans">
                    <h4 className="text-[10px] uppercase font-mono font-black text-gray-405 tracking-wider pb-1 border-b border-dashed border-gray-200 dark:border-zinc-800">
                      Purchased Items Grid
                    </h4>

                    {activeSuccessInvoice.items.map((item: CartItem) => (
                      <div key={item.product.id} className="flex justify-between items-center text-xs pb-1">
                        <div className="max-w-[70%]">
                          <span className="font-black text-gray-800 dark:text-gray-150">{item.product.name}</span>
                          <span className="text-[10.5px] text-gray-400 block">Quantity: {item.quantity} units @ ${item.product.price.toFixed(2)} each</span>
                        </div>
                        <span className="font-mono font-black text-gray-900 dark:text-white">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary math */}
                  <div className="pt-4 border-t border-dashed border-gray-155 dark:border-zinc-800 space-y-1.5 flex flex-col items-end">
                    <div className="w-56 font-sans text-xs space-y-1.5">
                      <div className="flex justify-between text-gray-500">
                        <span>Items Subtotal:</span>
                        <span className="font-mono font-bold">${activeSuccessInvoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                        <span>Dispatch Shipping:</span>
                        <span className="font-mono font-bold">
                          {activeSuccessInvoice.shippingCost === 0 ? "FREE" : `$${activeSuccessInvoice.shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-150 dark:border-zinc-800 flex justify-between text-sm font-black text-gray-900 dark:text-white">
                        <span>Total Paid:</span>
                        <span className="font-mono text-emerald-550">${activeSuccessInvoice.total.toFixed(2)} Credits</span>
                      </div>
                    </div>
                  </div>

                  {/* Stamp & Seal certificate block */}
                  <div className="pt-6 border-t border-gray-150 dark:border-zinc-800 flex justify-between items-center font-sans">
                    <div className="text-[10px] text-gray-400 leading-relaxed max-w-sm">
                      Note: This is an official digital corporate invoice issued directly via LookUpto predict-point online marketplace. Handled under certified smart staking security stamps. Non-refundable.
                    </div>
                    <div className="border border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/10 px-3 py-1 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-wider rounded-md pr-4 flex items-center gap-1.5 animate-pulse">
                      <Check className="w-3.5 h-3.5" />
                      Paid Seal Secured
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#242526] rounded-2xl border border-gray-200 dark:border-zinc-800 p-12 text-center text-gray-400">
                <FileSpreadsheet className="w-12 h-12 mx-auto text-gray-300 dark:text-zinc-650 mb-3" />
                <h3 className="font-bold text-gray-800 dark:text-gray-200">No active invoice selected</h3>
                <p className="text-xs text-gray-505 mt-1">Please select a purchased receipt from the sidebar index to view details.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
