import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Product } from '../data/products';

const ADMIN_SEED = {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@sportsfolio.com',
  password: 'admin123',
  role: 'admin' as const,
};

interface CartItem extends Product {
  qty: number;
}

interface ToastData {
  msg: string;
  sub: string;
  visible: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface StoredUser extends AuthUser {
  password: string;
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
}

const AppContext = createContext<AppContextType>({} as AppContextType);

function loadUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem('cricket_users') || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem('cricket_users', JSON.stringify(users));
}

function loadSession(): AuthUser | null {
  try {
    return JSON.parse(localStorage.getItem('cricket_session') || 'null');
  } catch {
    return null;
  }
}

function saveSession(user: AuthUser | null) {
  if (user) {
    localStorage.setItem('cricket_session', JSON.stringify(user));
  } else {
    localStorage.removeItem('cricket_session');
  }
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [toast, setToast] = useState<ToastData>({ msg: '', sub: '', visible: false });
  const [presetCategory, setPresetCategory] = useState('all');
  const [user, setUser] = useState<AuthUser | null>(loadSession);

  useEffect(() => {
    const users = loadUsers();
    if (!users.find(u => u.email === ADMIN_SEED.email)) {
      saveUsers([...users, ADMIN_SEED]);
    }
  }, []);

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
      if (existing) {
        return prev.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c);
      }
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
    const users = loadUsers();
    const found = users.find(u => u.email === email.toLowerCase().trim());
    if (!found) return { success: false, error: 'No account found with this email' };
    if (found.password !== password) return { success: false, error: 'Incorrect password' };
    const session: AuthUser = { id: found.id, name: found.name, email: found.email, role: found.role };
    setUser(session);
    saveSession(session);
    return { success: true };
  }, []);

  const register = useCallback((name: string, email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();
    const users = loadUsers();
    if (users.find(u => u.email === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists' };
    }
    const newUser: StoredUser = {
      id: genId(),
      name: name.trim(),
      email: cleanEmail,
      password,
      role: 'user',
    };
    saveUsers([...users, newUser]);
    const session: AuthUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    setUser(session);
    saveSession(session);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveSession(null);
  }, []);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      cart, addToCart, removeFromCart, updateQty, cartCount,
      currentPage, showPage,
      toast, showToast,
      presetCategory, setPresetCategory,
      user, isLoggedIn, isAdmin, login, register, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
