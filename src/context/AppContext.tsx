import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product, allProducts } from '../data/products';

const ADMIN_SEED = {
  id: 'admin-1', name: 'Admin', email: 'admin@sportsfolio.com',
  password: 'admin123', role: 'admin' as const,
};

interface CartItem extends Product { qty: number }

interface ToastData { msg: string; sub: string; visible: boolean }

export interface AuthUser { id: string; name: string; email: string; role: 'user' | 'admin' }

interface StoredUser extends AuthUser { password: string }

export interface OrderItem { productId: number; name: string; price: number; qty: number }

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  cartCount: number;
  currentPage: string;
  showPage: (page: string) => void;
  toast: ToastData;
  showToast: (msg: string, sub: string) => void;
  presetCategory: string;
  setPresetCategory: (cat: string) => void;
  user: AuthUser | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  products: Product[];
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  orders: Order[];
  updateOrderStatus: (id: string, status: 'pending' | 'shipped' | 'delivered') => void;
  placeOrder: () => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

function loadJSON<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}
function saveJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}
function genId(): string { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
function genNumId(existing: number[]): number { return existing.length ? Math.max(...existing) + 1 : 1; }

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [toast, setToast] = useState<ToastData>({ msg: '', sub: '', visible: false });
  const [presetCategory, setPresetCategory] = useState('all');
  const [user, setUser] = useState<AuthUser | null>(() => loadJSON('cricket_session', null));
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = loadJSON<Product[]>('cricket_products', null);
    if (stored) return stored;
    saveJSON('cricket_products', allProducts);
    return allProducts;
  });
  const [orders, setOrders] = useState<Order[]>(() => loadJSON<Order[]>('cricket_orders', []));

  useEffect(() => {
    const users = loadJSON<StoredUser[]>('cricket_users', []);
    if (!users.find(u => u.email === ADMIN_SEED.email)) {
      saveJSON('cricket_users', [...users, ADMIN_SEED]);
    }
  }, []);

  useEffect(() => { saveJSON('cricket_products', products); }, [products]);
  useEffect(() => { saveJSON('cricket_orders', orders); }, [orders]);

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

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
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

  const login = useCallback((email: string, password: string) => {
    const users = loadJSON<StoredUser[]>('cricket_users', []);
    const found = users.find(u => u.email === email.toLowerCase().trim());
    if (!found) return { success: false, error: 'No account found with this email' };
    if (found.password !== password) return { success: false, error: 'Incorrect password' };
    const session: AuthUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    setUser(session);
    saveJSON('cricket_session', session);
    return { success: true };
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const users = loadJSON<StoredUser[]>('cricket_users', []);
    if (users.find(u => u.email === cleanEmail)) return { success: false, error: 'An account with this email already exists' };
    const newUser: StoredUser = { id: genId(), name: name.trim(), email: cleanEmail, password, role: 'user' };
    saveJSON('cricket_users', [...users, newUser]);
    const session: AuthUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    setUser(session);
    saveJSON('cricket_session', session);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveJSON('cricket_session', null);
  }, []);

  const addProduct = useCallback((p: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { id: genNumId(prev.map(x => x.id)), ...p }]);
  }, []);

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback((id: string, status: 'pending' | 'shipped' | 'delivered') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  const placeOrder = useCallback(() => {
    if (!user || cart.length === 0) return;
    const order: Order = {
      id: genId(),
      userId: user.id,
      userName: user.name,
      items: cart.map(c => ({ productId: c.id, name: c.name, price: c.price, qty: c.qty })),
      total: cart.reduce((sum, c) => sum + c.price * c.qty, 0),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOrders(prev => [...prev, order]);
    setCart([]);
    showToast('Order Placed!', `Order #${order.id.slice(0, 8)} placed successfully`);
  }, [user, cart, showToast]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, cart, addToCart, removeFromCart, updateQty, cartCount,
      currentPage, showPage, toast, showToast,
      presetCategory, setPresetCategory,
      user, isLoggedIn, isAdmin, login, register, logout,
      products, addProduct, updateProduct, deleteProduct,
      orders, updateOrderStatus, placeOrder,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
