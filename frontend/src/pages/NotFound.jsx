import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <SEO
        title={t('notFound.title')}
        description={t('notFound.description')}
        noIndex
      />

      <section className="bg-brand-pale">
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center"
        >
          <p className="font-display text-7xl md:text-9xl font-bold text-brand/20 mb-4">404</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">
            {t('notFound.heading')}
          </h1>
          <p className="text-text-mid text-base md:text-lg max-w-lg mx-auto mb-10">
            {t('notFound.body')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors">
              {t('notFound.homeButton')}
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-rule text-text-mid text-sm font-medium hover:bg-surface transition-colors">
              {t('notFound.contactButton')}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
