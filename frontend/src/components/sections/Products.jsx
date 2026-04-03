import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ProductCard from '../ui/ProductCard';
import { getFeaturedProduct } from '../../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ProductsSection() {
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);

  const fallback = {
    name: t('products.ei.name'),
    tagline: t('products.ei.tagline'),
    description: t('products.ei.description'),
    badges: t('products.ei.badges', { returnObjects: true }),
    link: '/products',
  };

  useEffect(() => {
    getFeaturedProduct().then(data => { if (data) setProduct({ ...data, link: '/products' }); }).catch(() => {});
  }, []);

  // Use i18n translations when not English, API data only for English
  const display = i18n.language !== 'en' ? fallback : (product || fallback);

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
            {t('products.ei.label')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-12">
            {t('products.heading')}
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUp}
        >
          <ProductCard
            name={display.name}
            tagline={display.tagline}
            description={display.description}
            badges={display.badges || []}
            link={display.link || '/products'}
          />
        </motion.div>
      </div>
    </section>
  );
}
