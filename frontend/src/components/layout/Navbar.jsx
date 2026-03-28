import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-rule'
          : 'bg-white'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-semibold text-brand-dark tracking-tight">
          Evawero Digital
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === to
                    ? 'text-brand'
                    : 'text-text-mid hover:text-brand'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link
          to="/contact"
          className="hidden md:inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-dark transition-colors duration-200"
        >
          Book Assessment
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-px bg-text transition-all duration-300 ${
              open ? 'rotate-45 translate-y-[3.5px]' : ''
            }`}
          />
          <span
            className={`block w-5 h-px bg-text transition-all duration-300 ${
              open ? '-rotate-45 -translate-y-[3.5px]' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-white border-b border-rule"
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`block text-sm font-medium ${
                      location.pathname === to
                        ? 'text-brand'
                        : 'text-text-mid'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-md"
                >
                  Book Assessment
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
