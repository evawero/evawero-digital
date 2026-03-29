import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { getFeaturedProduct } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const fallbackProduct = {
  name: 'Evas Intelligence',
  tagline: 'Your briefing. Already done. Every morning.',
  description: 'AI-powered platform that scans your Gmail and news feeds, then delivers a prioritised intelligence briefing with action steps. Built for CEOs, consultants, and investors across Nigeria and Europe.',
  features: ['Inbox Intelligence \u2014 AI analysis of your Gmail', 'Market Intelligence \u2014 curated RSS and news monitoring', 'Content Creation \u2014 AI-assisted content from your signals'],
  link: 'https://app.evaweroukpevo.com',
  pricing_free: '\u20AC0 per month',
  pricing_pro: '\u20AC10 per month',
  badges: ['AI-Powered', 'Nigeria + Europe', 'Free to start'],
};

const steps = [
  { step: '01', text: 'Connect your email securely' },
  { step: '02', text: 'AI scans and extracts key signals' },
  { step: '03', text: 'View your prioritised briefing' },
  { step: '04', text: 'Take action with smart recommendations' },
];

export default function Products() {
  const [product, setProduct] = useState(fallbackProduct);

  useEffect(() => {
    getFeaturedProduct().then(data => { if (data) setProduct(data); }).catch(() => {});
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Products | Evawero Digital Solutions</title>
        <meta name="description" content="Discover Evas Intelligence \u2014 AI-powered business intelligence that turns your inbox into actionable insights." />
      </Helmet>

      {/* Hero */}
      <section className="bg-brand-pale">
        <motion.div initial="hidden" animate="show" variants={fadeUp} className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-wider text-brand mb-4">Products</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-dark">Our Products</h1>
          <p className="mt-4 text-text-mid text-base md:text-lg max-w-xl leading-relaxed">
            Tools we build and ship. Designed to solve real problems for real businesses.
          </p>
        </motion.div>
      </section>

      {/* Featured Product */}
      <section className="border-t border-rule">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}>
            <div className="bg-brand-dark rounded-md p-8 md:p-12">
              <p className="text-brand-mid text-sm font-medium uppercase tracking-wider mb-2">Featured Product</p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">{product.name}</h2>
              <p className="text-brand-border text-lg italic mb-6">{product.tagline}</p>
              <p className="text-white/80 leading-relaxed max-w-2xl">{product.description}</p>
              {product.badges?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.badges.map(b => (
                    <span key={b} className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/90">{b}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Features / Modules */}
          {product.features?.length > 0 && (
            <div className="mt-16">
              <motion.h3 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-8">Core Modules</motion.h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {product.features.map((feat, i) => {
                  const [title, ...rest] = feat.split(' \u2014 ');
                  const desc = rest.join(' \u2014 ') || title;
                  return (
                    <motion.div key={feat} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } } }}
                      className="border border-rule rounded-md p-6">
                      <h4 className="font-display text-lg font-semibold text-brand-dark mb-2">{rest.length ? title : `Module ${i + 1}`}</h4>
                      <p className="text-sm text-text-mid leading-relaxed">{desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="mt-16">
            <motion.h3 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-8">How It Works</motion.h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((s, i) => (
                <motion.div key={s.step} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } } }}>
                  <span className="font-display text-3xl font-bold text-brand-border">{s.step}</span>
                  <p className="mt-2 text-sm text-text-mid">{s.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-16 border-t border-rule pt-16">
            <motion.h3 initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-8">Pricing</motion.h3>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
              <div className="border border-rule rounded-md p-6">
                <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">Free</h4>
                <p className="text-xl font-bold text-text mb-1">{product.pricing_free || '\u20AC0'}</p>
                <p className="text-sm text-text-muted">Basic inbox scanning and insights. Perfect for getting started.</p>
              </div>
              <div className="border border-brand rounded-md p-6">
                <h4 className="font-display text-lg font-semibold text-brand-dark mb-1">Pro</h4>
                <p className="text-xl font-bold text-text mb-1">{product.pricing_pro || '\u20AC10'}</p>
                <p className="text-sm text-text-muted">Full AI insights, action dashboard, and priority support.</p>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mt-8">
              <Button href={product.link || 'https://app.evaweroukpevo.com'}>Try Evas Intelligence</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* More Coming Soon */}
      <section className="border-t border-rule bg-surface">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} variants={fadeUp}
          className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">More Coming Soon</h2>
          <p className="text-text-mid max-w-lg mx-auto">We are always building. Stay tuned for new tools designed to help businesses operate smarter.</p>
        </motion.div>
      </section>
    </>
  );
}
