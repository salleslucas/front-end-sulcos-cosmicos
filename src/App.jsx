import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import DiscDetail from './pages/DiscDetail';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import logoImg from './assets/sulcos_cosmicos_logo.png';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen">
          <Navbar />
          <CartDrawer />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/disco/:id" element={<DiscDetail />} />
              <Route path="/carrinho" element={<Cart />} />
              <Route path="/historico" element={<OrderHistory />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="border-t border-white/5 mt-10 py-5">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <img src={logoImg} alt="Sulcos Cósmicos" className="h-9 object-contain opacity-80" />
              <p className="text-cosmic-muted text-xs font-mono tracking-widest uppercase">
                Descubra o disco pelo sulco
              </p>
              <p className="text-cosmic-muted/40 text-xs">
                © {new Date().getFullYear()} Sulcos Cósmicos
              </p>
            </div>
          </footer>
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#f5f0e8',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </CartProvider>
    </BrowserRouter>
  );
}
