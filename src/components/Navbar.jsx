import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import marcaDaguaImg from "../assets/sulcos_cosmicos_logo.png";

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();
  const location = useLocation();

  const links = [
    { to: '/', label: 'Catálogo' },
    { to: '/historico', label: 'Histórico' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cosmic-black/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo — marca d'água */}
        <Link to="/" className="flex items-center group flex-shrink-0">
          <img
            src={marcaDaguaImg}
            alt="Sulcos Cósmicos"
            className="h-20 w-50 object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-6">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors relative pb-0.5 ${
                location.pathname === link.to
                  ? 'text-cosmic-gold'
                  : 'text-cosmic-muted hover:text-cosmic-cream'
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-px left-0 right-0 h-px bg-cosmic-gold"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Cart button */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center gap-2 btn-ghost py-2 px-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="hidden sm:inline text-sm">Carrinho</span>
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1.5 -right-1.5 bg-cosmic-gold text-cosmic-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
