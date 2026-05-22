import { AppProvider, useApp } from './context/AppContext';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Footer from './components/Footer';
import Toast from './components/Toast';
import BackToTop from './components/BackToTop';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';

function AppContent() {
  const { currentPage } = useApp();

  return (
    <>
      <Preloader />
      <Header />
      <main style={{ background: 'var(--bg)', transition: 'background 0.5s ease' }}>
        <div style={{ display: currentPage === 'home' ? 'block' : 'none' }}>
          <HomePage />
        </div>
        <div style={{ display: currentPage === 'shop' ? 'block' : 'none' }}>
          <ShopPage />
        </div>
        <div style={{ display: currentPage === 'contact' ? 'block' : 'none' }}>
          <ContactPage />
        </div>
        <div style={{ display: currentPage === 'cart' ? 'block' : 'none' }}>
          <CartPage />
        </div>
      </main>
      <Footer />
      <Toast />
      <BackToTop />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
