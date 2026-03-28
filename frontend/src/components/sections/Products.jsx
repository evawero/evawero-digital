import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../ui/ProductCard';
import { getFeaturedProduct } from '../../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const fallback = {
  name: 'Evas Intelligence',
  tagline: 'Your briefing. Already done. Every morning.',
  description: 'AI-powered platform that scans your Gmail and news feeds, then delivers a prioritised intelligence briefing with action steps. Built for CEOs, consultants, and investors across Nigeria and Europe.',
  badges: ['AI-Powered', 'Nigeria + Europe', 'Free to start'],
  link: '/products',
};

export default function ProductsSection() {
  const [product, setProduct] = useState(fallback);

  useEffect(() => {
    getFeaturedProduct().then(data => { if (data) setProduct({ ...data, link: '/products' }); }).catch(() => {});
  }, []);

  return (
    <section className="border-t border-rule bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            Our Latest Product
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-12">
            Built for Modern Business
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUp}
        >
          <ProductCard
            name={product.name}
            tagline={product.tagline}
            description={product.description}
            badges={product.badges || []}
            link={product.link || '/products'}
          />
        </motion.div>
      </div>
    </section>
  );
}
