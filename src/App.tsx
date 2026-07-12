import { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import BackToTop from './components/BackToTop';
import CookieConsent from './components/CookieConsent';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ShippingPage from './pages/ShippingPage';
import NotFoundPage from './pages/NotFoundPage';

const KNOWN_PAGES = ['home', 'shop', 'contact', 'cart', 'login', 'register', 'admin', 'my-orders', 'forgot-password', 'privacy', 'terms', 'shipping'];

function AppContent() {
  const { currentPage, showPage, showToast } = useApp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('order') === 'success') {
      showToast('Payment Successful!', 'Your order has been placed');
      showPage('my-orders');
      window.history.replaceState({}, '', '/');
    } else if (params.get('page') === 'cart') {
      showPage('cart');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  function showPageDisplay(page: string) {
    return currentPage === page ? 'block' : 'none';
  }

  return (
    <>
      <Header />
      <main style={{ background: 'var(--bg)', transition: 'background 0.5s ease' }}>
        <div style={{ display: showPageDisplay('home') }}><HomePage /></div>
        <div style={{ display: showPageDisplay('shop') }}><ShopPage /></div>
        <div style={{ display: showPageDisplay('contact') }}><ContactPage /></div>
        <div style={{ display: showPageDisplay('cart') }}><CartPage /></div>
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'register' && <RegisterPage />}
        <div style={{ display: showPageDisplay('admin') }}><AdminPage /></div>
        <div style={{ display: showPageDisplay('my-orders') }}><MyOrdersPage /></div>
        <div style={{ display: showPageDisplay('forgot-password') }}><ForgotPasswordPage /></div>
        <div style={{ display: showPageDisplay('privacy') }}><PrivacyPage /></div>
        <div style={{ display: showPageDisplay('terms') }}><TermsPage /></div>
        <div style={{ display: showPageDisplay('shipping') }}><ShippingPage /></div>
        {!KNOWN_PAGES.includes(currentPage) && <NotFoundPage />}
      </main>
      <Footer />
      <Toast />
      <BackToTop />
      <CookieConsent />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
