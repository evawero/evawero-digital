import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/products', label: t('nav.products') },
    { to: '/about', label: t('nav.about') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const toggleLang = () => {
    const next = i18n.language === 'de' ? 'en' : 'de';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
    document.documentElement.lang = next;
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

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
        <Link to="/" className="flex items-center gap-2.5">
          <svg viewBox="0 0 32 32" className="w-8 h-8 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="6" fill="#1D9E75"/>
            <text x="16" y="22" fontFamily="system-ui, -apple-system, sans-serif" fontSize="16" fontWeight="700" fill="white" textAnchor="middle" letterSpacing="-0.5">ED</text>
          </svg>
          <span className="font-display text-xl font-semibold text-brand-dark tracking-tight">
            {t('nav.brand')}
          </span>
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

        <div className="hidden md:flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="px-3 py-1.5 text-xs font-semibold border border-rule rounded-md text-text-mid hover:text-brand hover:border-brand transition-colors duration-200"
          >
            {i18n.language === 'de' ? 'EN' : 'DE'}
          </button>

          {/* Desktop CTA */}
          <Link
            to="/contact"
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-brand rounded-md hover:bg-brand-dark transition-colors duration-200"
          >
            {t('nav.bookAssessment')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
          aria-label={t('nav.toggleMenu')}
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
              <li className="flex items-center gap-3">
                <button
                  onClick={toggleLang}
                  className="px-3 py-1.5 text-xs font-semibold border border-rule rounded-md text-text-mid hover:text-brand hover:border-brand transition-colors"
                >
                  {i18n.language === 'de' ? 'EN' : 'DE'}
                </button>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-brand rounded-md"
                >
                  {t('nav.bookAssessment')}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
