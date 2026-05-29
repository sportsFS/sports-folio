import { AppProvider, useApp } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import Preloader from './components/Preloader';
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
  const { currentPage } = useApp();

  function showPage(page: string) {
    return currentPage === page ? 'block' : 'none';
  }

  return (
    <>
      <Preloader />
      <Header />
      <main style={{ background: 'var(--bg)', transition: 'background 0.5s ease' }}>
        <div style={{ display: showPage('home') }}><HomePage /></div>
        <div style={{ display: showPage('shop') }}><ShopPage /></div>
        <div style={{ display: showPage('contact') }}><ContactPage /></div>
        <div style={{ display: showPage('cart') }}><CartPage /></div>
        <div style={{ display: showPage('login') }}><LoginPage /></div>
        <div style={{ display: showPage('register') }}><RegisterPage /></div>
        <div style={{ display: showPage('admin') }}><AdminPage /></div>
        <div style={{ display: showPage('my-orders') }}><MyOrdersPage /></div>
        <div style={{ display: showPage('forgot-password') }}><ForgotPasswordPage /></div>
        <div style={{ display: showPage('privacy') }}><PrivacyPage /></div>
        <div style={{ display: showPage('terms') }}><TermsPage /></div>
        <div style={{ display: showPage('shipping') }}><ShippingPage /></div>
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
