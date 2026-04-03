import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ServiceCard from '../ui/ServiceCard';
import { getServices } from '../../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function ServicesSection() {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState(null);

  const i18nServices = [
    { icon: 'brain', title: t('services.items.ai.title'), short_description: t('services.items.ai.description') },
    { icon: 'zap', title: t('services.items.automation.title'), short_description: t('services.items.automation.description') },
    { icon: 'globe', title: t('services.items.web.title'), short_description: t('services.items.web.description') },
    { icon: 'target', title: t('services.items.brand.title'), short_description: t('services.items.brand.description') },
  ];

  useEffect(() => {
    getServices().then(data => { if (data.length) setServices(data); }).catch(() => {});
  }, []);

  // Use i18n translations when not English, API data only for English
  const displayServices = i18n.language !== 'en' ? i18nServices : (services || i18nServices);

  return (
    <section className="border-t border-rule">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          variants={fadeUp}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
            {t('services.eyebrow')}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark">
            {t('services.heading')}
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {displayServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } },
              }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>

        <div className="mt-10">
          <Link to="/services" className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">
            {t('services.viewAll')}
          </Link>
        </div>
      </div>
    </section>
  );
}
