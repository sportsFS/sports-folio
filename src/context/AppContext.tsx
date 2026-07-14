import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useClerk, useUser } from '@clerk/react';
import { useQuery, useMutation, useAction, useConvexAuth } from 'convex/react';
import { api } from '../../convex/_generated/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews?: number;
  badge?: string;
  badgeClass?: string;
  description?: string;
  stockQuantity?: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  isActive?: boolean;
  addOnProductIds?: string[];
}

interface CartItem extends Product { qty: number }

type ToastType = 'success' | 'error' | 'info';
interface ToastData { msg: string; sub: string; type: ToastType; visible: boolean }

export interface AuthUser { id: string; name: string; email: string; role: 'user' | 'admin' }

export interface OrderItem { productId: string; name: string; price: number; qty: number }

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  shippingAmount?: number;
  shippingAddress?: {
    name: string;
    line1: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentIntent?: string;
  stripeSessionId?: string;
  trackingNumber?: string;
  inventoryStatus?: 'reserved' | 'sold' | 'released' | 'error';
  deliveredAt?: string;
  returnRequest?: {
    type: 'exchange' | 'replacement';
    reason: string;
    status: 'requested' | 'approved' | 'rejected' | 'received' | 'completed';
    requestedAt: string;
    updatedAt?: string;
    adminNote?: string;
  };
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  cartCount: number;
  currentPage: string;
  showPage: (page: string) => void;
  toast: ToastData;
  showToast: (msg: string, sub: string, type?: ToastType) => void;
  presetCategory: string;
  setPresetCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  user: AuthUser | null;
  authError: string | null;
  isAuthLoading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  orders: Order[];
  requestReturn: (id: string, type: 'exchange' | 'replacement', reason: string) => Promise<{ success: boolean; error?: string }>;
  updateOrderStatus: (id: string, status: 'pending' | 'shipped' | 'delivered', trackingNumber?: string) => Promise<void>;
  placeOrder: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);
const pages = new Set(['home', 'shop', 'contact', 'cart', 'login', 'register', 'admin', 'my-orders', 'forgot-password', 'privacy', 'terms', 'shipping']);

function pageFromPath(pathname: string) {
  const page = pathname.replace(/^\/+/, '').split('/')[0] || 'home';
  return pages.has(page) ? page : 'home';
}

function pathForPage(page: string) {
  return page === 'home' ? '/' : `/${page}`;
}

function loadJSON<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}
function saveJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn } = useUser();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cart, setCart] = useState<CartItem[]>(() => loadJSON('cricket_cart', []));
  const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));
  const [toast, setToast] = useState<ToastData>({ msg: '', sub: '', type: 'success', visible: false });
  const [presetCategory, setPresetCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const profileSyncStarted = useRef(false);

  // Convex hooks
  const productsData = useQuery(api.products.list);
  const addProductMutation = useMutation(api.products.add);
  const updateProductMutation = useMutation(api.products.update);
  const deleteProductMutation = useMutation(api.products.remove);
  const ensureCurrentUser = useMutation(api.users.ensureCurrent);
  const requestReturnMutation = useMutation(api.orders.requestReturn);
  const updateOrderStatusMutation = useMutation(api.orders.updateStatus);
  const createCheckoutSession = useAction(api.stripe.createCheckoutSession);

  const currentUserData = useQuery(api.users.current, isAuthenticated ? {} : "skip");
  const user = (currentUserData || null) as AuthUser | null;
  const ordersData = useQuery(api.orders.list, isAuthenticated && user ? {} : "skip");

  useEffect(() => {
    if (!isSignedIn || isAuthenticated) return;
    const timeout = window.setTimeout(() => {
      setAuthError('Backend authentication timed out. Confirm the Clerk Convex integration is active, then sign out and retry.');
    }, 10_000);
    return () => window.clearTimeout(timeout);
  }, [isSignedIn, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      profileSyncStarted.current = false;
      setAuthError(null);
      return;
    }
    if (profileSyncStarted.current) return;
    profileSyncStarted.current = true;
    setAuthError(null);
    ensureCurrentUser().catch((err) => {
      profileSyncStarted.current = false;
      setAuthError(err instanceof Error ? err.message : 'Could not initialize your account.');
      console.error('Failed to initialize Clerk user profile:', err);
    });
  }, [isAuthenticated, ensureCurrentUser]);

  // Persist cart to localStorage
  useEffect(() => {
    saveJSON('cricket_cart', cart);
  }, [cart]);

  const products: Product[] = useMemo(() => {
    if (!productsData) return [];
    return productsData as any as Product[];
  }, [productsData]);

  const orders: Order[] = useMemo(() => {
    if (!ordersData) return [];
    return ordersData as any as Order[];
  }, [ordersData]);

  const isLoggedIn = user !== null;
  const isAdmin = user?.role === 'admin';
  const isAuthLoading = !isLoaded || isLoading || Boolean(
    isSignedIn && (!isAuthenticated || currentUserData === undefined || (currentUserData === null && !authError))
  );

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const addToCart = useCallback((product: Product) => {
    const available = product.availableQuantity ?? 0;
    if (product.isActive === false || available < 1) return;
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: Math.min(c.qty + 1, available) } : c);
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(c => c.id === id);
      if (!item) return prev;
      const currentProduct = products.find(product => product.id === id);
      const available = currentProduct?.availableQuantity ?? 0;
      const newQty = item.qty + delta;
      const nextQty = Math.min(newQty, available);
      if (nextQty <= 0) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: nextQty } : c);
    });
  }, [products]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const showToast = useCallback((msg: string, sub: string, type: ToastType = 'success') => {
    setToast({ msg, sub, type, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }, []);

  const showPage = useCallback((page: string) => {
    setCurrentPage(page);
    const path = pathForPage(page);
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const syncPage = () => setCurrentPage(pageFromPath(window.location.pathname));
    window.addEventListener('popstate', syncPage);
    return () => window.removeEventListener('popstate', syncPage);
  }, []);

  // Listen for navigate events from cookie consent
  useEffect(() => {
    const handler = (e: Event) => {
      const page = (e as CustomEvent).detail;
      if (page) showPage(page);
    };
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, [showPage]);

  const logout = useCallback(async () => {
    await signOut();
    setCurrentPage('home');
  }, [signOut]);

  const addProduct = useCallback(async (p: Omit<Product, 'id'>) => {
    await addProductMutation({
      name: p.name,
      price: p.price,
      oldPrice: p.oldPrice,
      image: p.image,
      category: p.category,
      rating: p.rating,
      reviews: p.reviews,
      badge: p.badge,
      badgeClass: p.badgeClass,
      description: p.description,
      stockQuantity: p.stockQuantity ?? 0,
      isActive: p.isActive ?? true,
      addOnProductIds: p.addOnProductIds as any,
    });
  }, [addProductMutation]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    await updateProductMutation({
      id: id as any,
      name: updates.name,
      price: updates.price,
      oldPrice: updates.oldPrice,
      image: updates.image,
      category: updates.category,
      rating: updates.rating,
      reviews: updates.reviews,
      badge: updates.badge,
      badgeClass: updates.badgeClass,
      description: updates.description,
      stockQuantity: updates.stockQuantity,
      isActive: updates.isActive,
      addOnProductIds: updates.addOnProductIds as any,
    });
  }, [updateProductMutation]);

  const deleteProduct = useCallback(async (id: string) => {
    await deleteProductMutation({ id: id as any });
  }, [deleteProductMutation]);

  const requestReturn = useCallback(async (id: string, type: 'exchange' | 'replacement', reason: string) => {
    try {
      await requestReturnMutation({ id: id as any, type, reason });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Return request failed' };
    }
  }, [requestReturnMutation]);

  const updateOrderStatus = useCallback(async (id: string, status: 'pending' | 'shipped' | 'delivered', trackingNumber?: string) => {
    await updateOrderStatusMutation({ id: id as any, status, trackingNumber });
  }, [updateOrderStatusMutation]);

  const placeOrder = useCallback(async () => {
    if (!user || cart.length === 0) return;
    try {
      const result = await createCheckoutSession({
        items: cart.map(c => ({
          productId: c.id as any,
          qty: c.qty,
        })) as any,
      });
      setCart([]);
      window.location.href = result.url!;
    } catch (err: any) {
      showToast('Checkout Failed', err.message || 'Something went wrong', 'error');
    }
  }, [user, cart, createCheckoutSession, showToast]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, cart, addToCart, removeFromCart, updateQty, cartCount,
      currentPage, showPage, toast, showToast,
      presetCategory, setPresetCategory,
      searchQuery, setSearchQuery,
      user, authError, isAuthLoading, isLoggedIn, isAdmin, logout,
      products, addProduct, updateProduct, deleteProduct,
      orders, requestReturn, updateOrderStatus, placeOrder,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
