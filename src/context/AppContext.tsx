import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
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
  description?: string;
}

interface CartItem extends Product { qty: number }

interface ToastData { msg: string; sub: string; visible: boolean }

export interface AuthUser { id: string; name: string; email: string; role: 'user' | 'admin' }

export interface OrderItem { productId: string; name: string; price: number; qty: number }

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
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
  showToast: (msg: string, sub: string) => void;
  presetCategory: string;
  setPresetCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  orders: Order[];
  cancelOrder: (id: string) => Promise<{ success: boolean; error?: string }>;
  updateOrderStatus: (id: string, status: 'pending' | 'shipped' | 'delivered') => Promise<void>;
  placeOrder: () => void;
  sendResetOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

function loadJSON<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}
function saveJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [toast, setToast] = useState<ToastData>({ msg: '', sub: '', visible: false });
  const [presetCategory, setPresetCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<AuthUser | null>(() => loadJSON('cricket_session', null));

  // Convex hooks
  const productsData = useQuery(api.products.list);
  const addProductMutation = useMutation(api.products.add);
  const updateProductMutation = useMutation(api.products.update);
  const deleteProductMutation = useMutation(api.products.remove);
  const loginMutation = useMutation(api.users.login);
  const registerMutation = useMutation(api.users.register);
  const sendOtpMutation = useMutation(api.otp.sendOtp);
  const verifyOtpMutation = useMutation(api.otp.verifyOtp);
  const seedMutation = useMutation(api.seed.seed);
  const placeOrderMutation = useMutation(api.orders.placeOrder);
  const cancelOrderMutation = useMutation(api.orders.cancelOrder);
  const updateOrderStatusMutation = useMutation(api.orders.updateStatus);
  const sendResetOtpMutation = useMutation(api.otp.sendResetOtp);
  const resetPasswordMutation = useMutation(api.otp.resetPassword);

  const ordersData = useQuery(api.orders.list, {
    userId: user?.id,
    isAdmin: user?.role === 'admin' || false,
  });

  // Seed admin + products once on first load
  const seeded = useRef(false);
  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      seedMutation();
    }
  }, [seedMutation]);

  const products: Product[] = useMemo(() => {
    if (!productsData) return [];
    return productsData as Product[];
  }, [productsData]);

  const orders: Order[] = useMemo(() => {
    if (!ordersData) return [];
    return ordersData as Order[];
  }, [ordersData]);

  const isLoggedIn = user !== null;
  const isAdmin = user?.role === 'admin';

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
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
      const newQty = item.qty + delta;
      if (newQty <= 0) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: newQty } : c);
    });
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const showToast = useCallback((msg: string, sub: string) => {
    setToast({ msg, sub, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
  }, []);

  const showPage = useCallback((page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await loginMutation({ email, password });
      const session: AuthUser = {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      };
      setUser(session);
      saveJSON('cricket_session', session);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }, [loginMutation]);

  const sendOtp = useCallback(async (name: string, email: string, password: string) => {
    try {
      await sendOtpMutation({ name, email, password });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send OTP' };
    }
  }, [sendOtpMutation]);

  const verifyOtp = useCallback(async (email: string, code: string) => {
    try {
      const result = await verifyOtpMutation({ email, code });
      const session: AuthUser = {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      };
      setUser(session);
      saveJSON('cricket_session', session);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification failed' };
    }
  }, [verifyOtpMutation]);

  const logout = useCallback(() => {
    setUser(null);
    saveJSON('cricket_session', null);
  }, []);

  const addProduct = useCallback(async (p: Omit<Product, 'id'>) => {
    await addProductMutation({
      userId: user?.id as any,
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
    });
  }, [addProductMutation, user]);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    await updateProductMutation({
      userId: user?.id as any,
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
    });
  }, [updateProductMutation, user]);

  const deleteProduct = useCallback(async (id: string) => {
    await deleteProductMutation({ userId: user?.id as any, id: id as any });
  }, [deleteProductMutation, user]);

  const cancelOrder = useCallback(async (id: string) => {
    try {
      await cancelOrderMutation({ id: id as any, userId: user?.id as any });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Cancellation failed' };
    }
  }, [cancelOrderMutation, user]);

  const updateOrderStatus = useCallback(async (id: string, status: 'pending' | 'shipped' | 'delivered') => {
    await updateOrderStatusMutation({ userId: user?.id as any, id: id as any, status });
  }, [updateOrderStatusMutation, user]);

  const sendResetOtp = useCallback(async (email: string) => {
    try {
      await sendResetOtpMutation({ email });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send reset code' };
    }
  }, [sendResetOtpMutation]);

  const resetPassword = useCallback(async (email: string, code: string, newPassword: string) => {
    try {
      await resetPasswordMutation({ email, code, newPassword });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Password reset failed' };
    }
  }, [resetPasswordMutation]);

  const placeOrder = useCallback(() => {
    if (!user || cart.length === 0) return;
    placeOrderMutation({
      userId: user.id as any,
      userName: user.name,
      items: cart.map(c => ({
        productId: c.id,
        name: c.name,
        price: c.price,
        qty: c.qty,
      })),
      total: cart.reduce((sum, c) => sum + c.price * c.qty, 0),
    });
    setCart([]);
    showToast('Order Placed!', 'Your order has been placed successfully');
  }, [user, cart, placeOrderMutation, showToast]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, cart, addToCart, removeFromCart, updateQty, cartCount,
      currentPage, showPage, toast, showToast,
      presetCategory, setPresetCategory,
      searchQuery, setSearchQuery,
      user, isLoggedIn, isAdmin, login, sendOtp, verifyOtp, logout,
      products, addProduct, updateProduct, deleteProduct,
      orders, cancelOrder, updateOrderStatus, placeOrder, sendResetOtp, resetPassword,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
